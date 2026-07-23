import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useNavigate } from "react-router";
import {
  Briefcase,
  FileCheck,
  Calendar,
  TrendingUp,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Building,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Video,
} from "lucide-react";

import { useState, useEffect } from "react";
import { api } from "../../api";

export function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Job Seeker");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [profileScore, setProfileScore] = useState(45);

  useEffect(() => {
    const userStr = localStorage.getItem("talentai.user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.firstName || "Job Seeker");
      } catch (err) {
        console.error("Error parsing user info", err);
      }
    }

    async function loadData() {
      try {
        const jobsData = await api.jobs.getAll();
        setJobs(jobsData || []);
        
        const userStr = localStorage.getItem("talentai.user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const cand = await api.candidates.getByUserId(user.id).catch(() => null);
          if (cand && cand.id) {
            setProfileScore(cand.profileCompleteness || 45);
            setProfileViews(cand.profileViews || 0);

            // Fetch base data
            const [apps, ivs] = await Promise.all([
              api.applications.getByCandidate(cand.id).catch(() => []),
              api.interviews.getByCandidate(cand.id).catch(() => [])
            ]);
            
            setApplicationsCount(apps?.length || 0);
            
            // Filter future interviews
            const now = new Date();
            const futureIvs = (ivs || []).filter((i: any) => new Date(i.scheduledAt) > now).sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
            setUpcomingInterviews(futureIvs.map((i: any) => ({
              id: i.id,
              company: i.companyName || "Organization",
              position: i.jobTitle || "Job Interview",
              date: new Date(i.scheduledAt).toLocaleDateString(),
              time: new Date(i.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              type: i.type || "Interview",
              link: i.meetingLink
            })));

            // Fetch AI analysis asynchronously
            api.ai.analyzeProfile(cand.id).then(analysis => {
              if (analysis) {
                if (analysis.skillBreakdown) {
                  setSkillGaps(analysis.skillBreakdown.map((s: any) => ({
                    skill: s.category,
                    current: s.score,
                    target: Math.min(100, s.score + 20)
                  })));
                }
                if (analysis.learningRecommendations) {
                  setLearningPaths(analysis.learningRecommendations.map((r: any) => ({
                    title: r.skill || "New Skill",
                    progress: 0,
                    lessons: 10,
                    completed: 0,
                    reason: r.reason
                  })));
                }
                if (analysis.jobMatches) {
                  setRecommendedJobs(analysis.jobMatches.slice(0, 3).map((jm: any) => ({
                    id: jm.jobId || Math.random().toString(),
                    title: jm.jobTitle || jm.title || "Job Match",
                    organization: { name: jm.company || "Company" },
                    location: jm.location || "Remote",
                    minimumSalary: parseInt(jm.salaryEstimate?.replace(/[^0-9]/g, '').substring(0, 3) + "000") || 80000,
                    maximumSalary: parseInt(jm.salaryEstimate?.replace(/[^0-9]/g, '').substring(3, 6) + "000") || 120000,
                    matchPercentage: jm.matchPercentage || 95,
                    employmentType: "Full-time"
                  })));
                }
              }
            }).catch(err => console.error("AI Analysis failed", err))
            .finally(() => setAiLoading(false));
          } else {
            setAiLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching jobs", err);
        setAiLoading(false);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardLayout role="jobseeker">
      {/* Welcome Section */}
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-background via-secondary to-[#D4AF37]/20 border border-[#D4AF37]/20 text-foreground shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700 ease-in-out">
          <Sparkles className="w-32 h-32 text-[#D4AF37]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-3">
            Welcome back, <span className="text-[#D4AF37]">{userName}</span>!
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Here's what's happening with your job search today. Let's find your dream job together.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="transform hover:-translate-y-1 transition-all duration-300 h-full">
          <StatCard
            title="Applications Sent"
            value={applicationsCount.toString()}
            icon={FileCheck}
            trend={{ value: applicationsCount > 0 ? 10 : 0, isPositive: true }}
            className="h-full"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-all duration-300 h-full">
          <StatCard
            title="Profile Views"
            value={profileViews.toString()}
            icon={TrendingUp}
            trend={{ value: profileViews > 0 ? 100 : 0, isPositive: true }}
            className="h-full"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-all duration-300 h-full">
          <StatCard
            title="Interviews"
            value={upcomingInterviews.length.toString()}
            icon={Calendar}
            trend={{ value: upcomingInterviews.length > 0 ? 25 : 0, isPositive: true }}
            className="h-full"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-all duration-300 h-full">
          <StatCard
            title="Job Matches"
            value={jobs.length.toString()}
            icon={Briefcase}
            className="h-full"
          />
        </div>
      </div>

      {/* Profile Completion */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Complete Your Profile</h3>
            <p className="text-muted-foreground">{profileScore}% completed - {profileScore === 100 ? "Great job!" : "Almost there!"}</p>
          </div>
          <div className="rounded-full bg-[#D4AF37]/10 p-3">
            <Star className="h-6 w-6 text-[#D4AF37]" />
          </div>
        </div>
        <Progress value={profileScore} className="mb-4" />
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">✓ Personal Info</Badge>
          <Badge variant="outline">Add Experience</Badge>
          <Badge variant="outline">Add Education</Badge>
          <Badge variant="outline">Add Certifications</Badge>
          <Badge variant="outline">Add Portfolio</Badge>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* AI Job Recommendations */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                <h2 className="text-xl font-semibold text-foreground">AI-Recommended Jobs</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/jobseeker/jobs")}>View All</Button>
            </div>
            <div className="space-y-4">
              {recommendedJobs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recommended jobs found at the moment.</p>
              ) : (
                recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                            {job.matchPercentage || 95}% Match
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{job.organization?.name || "TalentAI Inc."}</span>
                        </div>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${(job.minimumSalary / 1000).toFixed(0)}k - ${(job.maximumSalary / 1000).toFixed(0)}k</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{job.employmentType || "Full-time"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
                      <Button size="sm" onClick={() => navigate("/jobseeker/applications")}>Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-lg font-semibold text-foreground">Upcoming Interviews</h2>
            </div>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-1">{interview.company}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{interview.position}</p>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">{interview.date}</span>
                    <span className="text-[#D4AF37]">{interview.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{interview.type}</Badge>
                    <Button
                      size="sm"
                      className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 text-xs h-7"
                      onClick={() => interview.link ? window.open(interview.link, "_blank") : navigate("/interviews/video-room")}
                    >
                      <Video className="mr-1 h-3.5 w-3.5" /> Join Room
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Learning Paths */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-lg font-semibold text-foreground">Learning Paths</h2>
            </div>
            <div className="space-y-4">
              {learningPaths.length === 0 ? (
                <p className="text-muted-foreground text-sm">No learning paths suggested yet. Add more skills to get recommendations.</p>
              ) : (
                learningPaths.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">{course.title}</h4>
                      <span className="text-xs text-[#D4AF37]">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.reason || `${course.completed} of ${course.lessons} lessons completed`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="h-6 w-6 text-[#D4AF37]" />
          <h2 className="text-xl font-semibold text-foreground">AI Skill Gap Analysis</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {skillGaps.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-3">We are analyzing your profile to suggest skill gaps. Please check back later.</p>
          ) : (
            skillGaps.map((skill, index) => (
              <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{skill.skill}</h4>
                <Badge variant="outline">{skill.current}%</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current</span>
                  <span>Target: {skill.target}%</span>
                </div>
                <Progress value={skill.current} className="h-2" />
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Start Learning
              </Button>
            </div>
            ))
          )}
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
