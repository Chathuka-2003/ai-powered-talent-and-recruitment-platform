using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text;
using System.Text.Json;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly RecruitmentDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _modelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public AIController(RecruitmentDbContext context, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = config["Gemini:ApiKey"] ?? "";
    }

    // POST api/ai/analyze-profile /
    [HttpPost("analyze-profile")]
    public async Task<IActionResult> AnalyzeProfile([FromBody] AnalyzeProfileRequest req)
    {
        // 1. Fetch candidate profile
        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == req.CandidateId);

        if (candidate == null)
            return NotFound(new { message = "Candidate not found." });

        // 2. Fetch all active jobs (limit to 20 most recent)
        var jobs = await _context.Jobs
            .Include(j => j.Organization)
            .OrderByDescending(j => j.CreatedAt)
            .Take(20)
            .ToListAsync();

        if (jobs.Count == 0)
            return Ok(new AIProfileAnalysisResult());

        // 3. Build profile summary
        var profileText = BuildProfileText(candidate);
        var jobsText = BuildJobsText(jobs);

        // 4. Call Gemini
        var prompt = $@"
You are an expert career advisor AI. Analyze this candidate profile against multiple job listings and provide detailed insights.

CANDIDATE PROFILE:
{profileText}

JOB LISTINGS:
{jobsText}

Respond with ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{{
  ""overallProfileScore"": 78,
  ""profileStrengths"": [""Strong technical background"", ""Good project experience""],
  ""profileWeaknesses"": [""No cloud experience"", ""Missing leadership examples""],
  ""careerSuggestions"": [""Target mid-level roles in fintech"", ""Build a public portfolio on GitHub""],
  ""learningRecommendations"": [
    {{""skill"": ""Docker"", ""reason"": ""Required in 70% of matched jobs"", ""priority"": ""High""}},
    {{""skill"": ""TypeScript"", ""reason"": ""Boosts frontend match rate"", ""priority"": ""Medium""}}
  ],
  ""resumeImprovements"": [""Add quantified achievements"", ""Include LinkedIn URL"", ""Shorten summary to 3 lines""],
  ""jobMatches"": [
    {{
      ""jobId"": ""<actual-uuid>"",
      ""jobTitle"": ""<actual title>"",
      ""company"": ""<actual company>"",
      ""location"": ""<actual location>"",
      ""matchPercentage"": 85,
      ""matchedSkills"": [""React"", ""C#""],
      ""missingSkills"": [""Docker"", ""AWS""],
      ""whyGoodFit"": ""Strong alignment on core stack"",
      ""salaryEstimate"": ""$80k-$110k""
    }}
  ],
  ""skillBreakdown"": [
    {{""category"": ""Frontend"", ""score"": 80}},
    {{""category"": ""Backend"", ""score"": 65}},
    {{""category"": ""DevOps"", ""score"": 20}},
    {{""category"": ""Communication"", ""score"": 70}},
    {{""category"": ""Leadership"", ""score"": 40}}
  ]
}}

Analyze ALL {jobs.Count} jobs and include each one in jobMatches with real job IDs and titles from the listings above.";

        var (result, geminiError) = await CallGemini(prompt);
        if (result == null)
            return StatusCode(503, new { message = geminiError ?? "AI service temporarily unavailable." });

        return Ok(result);
    }

    // POST api/ai/match-job - Match a single specific job against candidate profile
    [HttpPost("match-job")]
    public async Task<IActionResult> MatchJob([FromBody] MatchJobRequest req)
    {
        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == req.CandidateId);

        var job = await _context.Jobs
            .Include(j => j.Organization)
            .FirstOrDefaultAsync(j => j.Id == req.JobId);

        if (candidate == null || job == null)
            return NotFound();

        var profileText = BuildProfileText(candidate);
        var prompt = $@"
Analyze this candidate profile against the job listing and respond with ONLY valid JSON (no markdown):
{{
  ""matchPercentage"": 82,
  ""matchedSkills"": [""React"", ""TypeScript""],
  ""missingSkills"": [""AWS""],
  ""whyGoodFit"": ""Strong alignment on frontend stack and experience level"",
  ""whyNotFit"": ""Lacks cloud deployment experience"",
  ""applicationTips"": [""Highlight React projects"", ""Mention API integration work""]
}}

CANDIDATE PROFILE:
{profileText}

JOB:
Title: {job.Title}
Company: {job.Organization?.Name ?? "N/A"}
Location: {job.Location}
Description: {(job.Description?.Length > 3000 ? job.Description.Substring(0, 3000) : job.Description)}
Salary: ${job.MinimumSalary:N0} - ${job.MaximumSalary:N0}";

        var (result, geminiError) = await CallGemini(prompt);
        return result != null ? Ok(result) : StatusCode(503, new { message = geminiError ?? "AI unavailable." });
    }

    [HttpPost("hm-resume-screening")]
    public async Task<IActionResult> HmResumeScreening([FromBody] MatchJobRequest req)
    {
        var candidate = await _context.Candidates.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == req.CandidateId);
        var job = await _context.Jobs.Include(j => j.Organization).FirstOrDefaultAsync(j => j.Id == req.JobId);
        if (candidate == null || job == null) return NotFound();

        var profileText = BuildProfileText(candidate);
        var prompt = $@"
Analyze this candidate against this job. Respond with ONLY valid JSON (no markdown):
{{
  ""overallScore"": 85,
  ""pros"": [""React experience"", ""5 years in industry""],
  ""cons"": [""No team lead experience""],
  ""recommendation"": ""Proceed to interview""
}}

CANDIDATE:
{profileText}

JOB:
Title: {job.Title}
Description: {job.Description}";

        var (result, err) = await CallGemini(prompt);
        if (result != null)
        {
            var application = await _context.JobApplications.FirstOrDefaultAsync(a => a.CandidateId == req.CandidateId && a.JobId == req.JobId);
            if (application != null && result is JsonElement root)
            {
                if (root.TryGetProperty("overallScore", out var scoreProp) && scoreProp.TryGetInt32(out var score))
                {
                    application.AIMatchScore = score;
                    await _context.SaveChangesAsync();
                }
            }
            return Ok(result);
        }
        
        return StatusCode(503, new { message = err });
    }

    [HttpPost("hm-candidate-ranking")]
    public async Task<IActionResult> HmCandidateRanking([FromBody] RankCandidatesRequest req)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == req.JobId);
        if (job == null) return NotFound();

        var candidateIds = req.CandidateIds ?? new List<Guid>();
        var candidates = await _context.Candidates.Include(c => c.User).Where(c => candidateIds.Contains(c.Id)).ToListAsync();
        if (!candidates.Any()) return Ok(new List<object>());

        var profilesStr = string.Join("\n\n--- \n\n", candidates.Select(c => $"ID: {c.Id}\n" + BuildProfileText(c)));
        var prompt = $@"
Rank the following candidates for the job. Return ONLY valid JSON array (no markdown) of objects:
[{{ ""candidateId"": ""guid"", ""rank"": 1, ""score"": 90, ""reason"": ""Best match"" }}]

JOB Title: {job.Title}
JOB Req: {job.Description}

CANDIDATES:
{profilesStr}";

        var (result, err) = await CallGemini(prompt);
        return result != null ? Ok(result) : StatusCode(503, new { message = err });
    }

    [HttpPost("hm-interview-questions")]
    public async Task<IActionResult> HmInterviewQuestions([FromBody] MatchJobRequest req)
    {
        var candidate = await _context.Candidates.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == req.CandidateId);
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == req.JobId);
        if (candidate == null || job == null) return NotFound();

        var profileText = BuildProfileText(candidate);
        var prompt = $@"
Generate 5 targeted interview questions for this candidate applying to this job. Return ONLY valid JSON array of strings:
[""Question 1"", ""Question 2""]

CANDIDATE:
{profileText}

JOB Title: {job.Title}
JOB Req: {job.Description}";

        var (result, err) = await CallGemini(prompt);
        return result != null ? Ok(result) : StatusCode(503, new { message = err });
    }

    [HttpPost("hm-generate-jd")]
    public async Task<IActionResult> HmGenerateJd([FromBody] GenerateJdRequest req)
    {
        var prompt = $@"
Generate a professional Job Description. Return ONLY valid JSON:
{{
  ""title"": ""{req.Title}"",
  ""description"": ""Full markdown description..."",
  ""requirements"": ""Requirements text..."",
  ""skills"": [""Skill1"", ""Skill2""]
}}

Title: {req.Title}
Keywords/Skills: {req.Keywords}
Experience Level: {req.ExperienceLevel}";

        var (result, err) = await CallGemini(prompt);
        return result != null ? Ok(result) : StatusCode(503, new { message = err });
    }

    [HttpPost("suite-generate")]
    public async Task<IActionResult> SuiteGenerate([FromBody] SuiteGenerateRequest req)
    {
        string prompt = "";
        
        // Fetch optional references if provided
        var candidate = req.CandidateId.HasValue ? await _context.Candidates.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == req.CandidateId) : null;
        var job = req.JobId.HasValue ? await _context.Jobs.FirstOrDefaultAsync(j => j.Id == req.JobId) : null;

        var profileText = candidate != null ? BuildProfileText(candidate) : "";
        var jobText = job != null ? $"Title: {job.Title}\nDescription: {job.Description}" : "";

        switch (req.ModuleType)
        {
            case "resume-analyzer":
                prompt = $"Analyze this resume and provide improvements, pros, cons, and formatting suggestions. Respond in JSON with keys: score, pros, cons, formatting.\nCANDIDATE: {profileText}";
                break;
            case "cv-improvement":
                prompt = $"Suggest 5 actionable bullet points to improve this CV for better ATS ranking. Respond with a JSON array of strings.\nCANDIDATE: {profileText}";
                break;
            case "ai-job-recommendations":
                prompt = $"Based on this profile, suggest 3 job titles they should apply for, and why. Respond in JSON array of objects with keys: title, reason.\nCANDIDATE: {profileText}";
                break;
            case "interview-preparation":
                prompt = $"Generate a 5-step interview preparation plan for this candidate based on their skills. Respond with a JSON array of strings.\nCANDIDATE: {profileText}";
                break;
            case "skill-gap-analysis":
                prompt = $"Compare this candidate's skills against this job. Identify missing skills and learning resources. Respond in JSON with keys: missingSkills, resources.\nCANDIDATE: {profileText}\nJOB: {jobText}";
                break;
            case "career-suggestions":
                prompt = $"Based on this profile, suggest a 5-year career progression path with 3 steps. Respond in JSON array of strings.\nCANDIDATE: {profileText}";
                break;
            case "ai-candidate-matching":
                prompt = $"Evaluate how well this candidate matches the job. Provide a match score (0-100) and 2 reasons. Respond in JSON with keys: matchScore, reasons.\nCANDIDATE: {profileText}\nJOB: {jobText}";
                break;
            case "candidate-summaries":
                prompt = $"Write a 3-sentence executive summary of this candidate's qualifications. Respond in JSON with key: summary.\nCANDIDATE: {profileText}";
                break;
            case "hiring-decision-insights":
                prompt = $"Provide hiring decision insights for this candidate applying to this job. What are the key risks and rewards? Respond in JSON with keys: risks, rewards, recommendation.\nCANDIDATE: {profileText}\nJOB: {jobText}";
                break;
            case "skill-comparison":
                prompt = $"Compare the candidate's skills with the job requirements. Provide an alignment percentage and a list of matching skills. Respond in JSON with keys: alignmentScore, matchingSkills.\nCANDIDATE: {profileText}\nJOB: {jobText}";
                break;
            default:
                return BadRequest("Unknown module type");
        }

        var (result, err) = await CallGemini(prompt);
        return result != null ? Ok(result) : StatusCode(503, new { message = err });
    }

    private string BuildProfileText(Domain.Entities.Candidate candidate)
    {
        var skills = "Not specified";
        if (!string.IsNullOrEmpty(candidate.SuggestedSkills))
        {
            try { skills = string.Join(", ", JsonSerializer.Deserialize<string[]>(candidate.SuggestedSkills) ?? []); } catch { }
        }

        return $@"Name: {candidate.User?.FirstName} {candidate.User?.LastName}
Headline: {candidate.ProfessionalHeadline ?? "Not set"}
Summary: {candidate.Summary ?? "Not set"}
Location: {candidate.Location ?? "Not set"}
Employment Type Preference: {candidate.EmploymentType ?? "Not set"}
Work Preference: {candidate.WorkPreference ?? "Not set"}
Preferred Role: {candidate.PreferredJobRole ?? "Not set"}
Skills: {skills}
Resume Score: {candidate.ResumeScore}/100
Profile Completeness: {candidate.ProfileCompleteness}%";
    }

    private string BuildJobsText(List<Domain.Entities.Job> jobs)
    {
        var sb = new StringBuilder();
        for (int i = 0; i < jobs.Count; i++)
        {
            var j = jobs[i];
            var desc = j.Description?.Length > 500 ? j.Description.Substring(0, 500) + "..." : j.Description;
            sb.AppendLine($@"Job {i + 1}:
  ID: {j.Id}
  Title: {j.Title}
  Company: {j.Organization?.Name ?? "N/A"}
  Location: {j.Location}
  Type: {j.EmploymentType}
  Salary: ${j.MinimumSalary:N0} - ${j.MaximumSalary:N0}
  Description: {desc}
");
        }
        return sb.ToString();
    }

    private async Task<(object? Result, string? Error)> CallGemini(string prompt)
    {
        var payload = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new { temperature = 0.3, maxOutputTokens = 4096 }
        };
        var json = JsonSerializer.Serialize(payload);

        for (int attempt = 1; attempt <= 3; attempt++)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, $"{_modelUrl}?key={_apiKey}")
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };

                var response = await _httpClient.SendAsync(request);
                var raw = await response.Content.ReadAsStringAsync();

                if ((int)response.StatusCode == 429)
                {
                    // Rate limited — wait and retry
                    int wait = attempt * 5;
                    Console.WriteLine($"Gemini 429 rate limit (attempt {attempt}), waiting {wait}s…");
                    await Task.Delay(wait * 1000);
                    continue;
                }

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Gemini HTTP {(int)response.StatusCode}: {raw}");
                    return (null, $"Gemini API returned {(int)response.StatusCode}. {raw.Substring(0, Math.Min(raw.Length, 400))}");
                }

                using var doc = JsonDocument.Parse(raw);
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text").GetString() ?? "";

                // Strip markdown wrappers
                text = text.Trim();
                if (text.StartsWith("```json")) text = text[7..];
                else if (text.StartsWith("```")) text = text[3..];
                if (text.EndsWith("```")) text = text[..^3];
                text = text.Trim();

                using var parsed = JsonDocument.Parse(text);
                return (JsonSerializer.Deserialize<object>(parsed.RootElement.GetRawText()), null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gemini exception (attempt {attempt}): {ex.Message}");
                if (attempt == 3) return (null, ex.Message);
                await Task.Delay(attempt * 2000);
            }
        }

        return (null, "Gemini API quota exceeded. Please wait a moment and try again.");
    }
}

public class AnalyzeProfileRequest
{
    public Guid CandidateId { get; set; }
}

public class MatchJobRequest
{
    public Guid CandidateId { get; set; }
    public Guid JobId { get; set; }
}

public class AIProfileAnalysisResult
{
    public int OverallProfileScore { get; set; } = 0;
    public string[] ProfileStrengths { get; set; } = [];
    public string[] ProfileWeaknesses { get; set; } = [];
    public string[] CareerSuggestions { get; set; } = [];
    public object[] LearningRecommendations { get; set; } = [];
    public string[] ResumeImprovements { get; set; } = [];
    public object[] JobMatches { get; set; } = [];
    public object[] SkillBreakdown { get; set; } = [];
}

public class RankCandidatesRequest
{
    public Guid JobId { get; set; }
    public List<Guid> CandidateIds { get; set; } = new();
}

public class GenerateJdRequest
{
    public string Title { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
}

public class SuiteGenerateRequest
{
    public string ModuleType { get; set; } = string.Empty;
    public Guid? CandidateId { get; set; }
    public Guid? JobId { get; set; }
}
