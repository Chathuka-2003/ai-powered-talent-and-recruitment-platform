using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using UglyToad.PdfPig;
using System.IO.Compression;

namespace Infrastructure.Services
{
    public class ResumeAnalyzerService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _modelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

        public ResumeAnalyzerService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"] ?? "";
        }

        public async Task<ResumeAnalysisResult> AnalyzeResumeAsync(string filePath)
        {
            var text = ExtractText(filePath);
            if (string.IsNullOrWhiteSpace(text)) return new ResumeAnalysisResult();

            // Truncate to avoid massive token usage if needed
            if (text.Length > 20000) text = text.Substring(0, 20000);

            var prompt = $@"
Analyze the following resume text and provide:
1. A Resume Score out of 100 based on quality, impact, and completeness.
2. A list of 3-5 Suggested Skills the candidate should add or highlight.
3. A list of 2-4 Improvement Suggestions to make the resume better.

Format the response EXACTLY as a JSON object with this structure, and nothing else (no markdown blocks like ```json):
{{
  ""score"": 85,
  ""skills"": [""Skill 1"", ""Skill 2""],
  ""suggestions"": [""Suggestion 1"", ""Suggestion 2""]
}}

Resume Text:
{text}
";

            var payload = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_modelUrl}?key={_apiKey}")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API failed: {err}");
            }

            var resultStr = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(resultStr);
            var root = doc.RootElement;
            
            var textResponse = root.GetProperty("candidates")[0]
                                  .GetProperty("content")
                                  .GetProperty("parts")[0]
                                  .GetProperty("text").GetString();

            if (textResponse == null) return new ResumeAnalysisResult();

            // Clean up possible markdown wrappers
            textResponse = textResponse.Trim();
            if (textResponse.StartsWith("```json")) textResponse = textResponse.Substring(7);
            if (textResponse.StartsWith("```")) textResponse = textResponse.Substring(3);
            if (textResponse.EndsWith("```")) textResponse = textResponse.Substring(0, textResponse.Length - 3);
            textResponse = textResponse.Trim();

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsed = JsonSerializer.Deserialize<ResumeAnalysisResult>(textResponse, options);
                return parsed ?? new ResumeAnalysisResult();
            }
            catch
            {
                return new ResumeAnalysisResult(); // Fallback on parse failure
            }
        }

        private string ExtractText(string filePath)
        {
            var ext = Path.GetExtension(filePath).ToLowerInvariant();
            if (ext == ".pdf") return ExtractFromPdf(filePath);
            if (ext == ".docx") return ExtractFromDocx(filePath);
            return "";
        }

        private string ExtractFromPdf(string filePath)
        {
            try
            {
                var text = new StringBuilder();
                using (var document = PdfDocument.Open(filePath))
                {
                    foreach (var page in document.GetPages())
                    {
                        text.AppendLine(page.Text);
                    }
                }
                return text.ToString();
            }
            catch { return ""; }
        }

        private string ExtractFromDocx(string filePath)
        {
            try
            {
                using var archive = ZipFile.OpenRead(filePath);
                var entry = archive.GetEntry("word/document.xml");
                if (entry == null) return "";

                using var stream = entry.Open();
                using var reader = new StreamReader(stream);
                var xml = reader.ReadToEnd();

                // Strip XML tags naively
                var text = System.Text.RegularExpressions.Regex.Replace(xml, "<.*?>", " ");
                return text;
            }
            catch { return ""; }
        }
    }

    public class ResumeAnalysisResult
    {
        public int Score { get; set; } = 0;
        public string[] Skills { get; set; } = Array.Empty<string>();
        public string[] Suggestions { get; set; } = Array.Empty<string>();
    }
}
