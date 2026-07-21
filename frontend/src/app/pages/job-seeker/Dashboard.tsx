import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useNavigate } from "react-router";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  CheckCircle,
  Building,
  MapPin,
  DollarSign,
} from "lucide-react";

export default function JobSeekerDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Applications", value: "12", icon: FileText, color: "text-blue-500" },
    { label: "Interviews", value: "3", icon: Calendar, color: "text-green-500" },
    { label: "Job Matches", value: "47", icon: Target, color: "text-purple-500" },
    { label: "Profile Views", value: "156", icon: TrendingUp, color: "text-primary" },
  ];

  const aiJobRecommendations = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$140K - $180K",
      type: "Full-time",
      matchScore: 95,
      postedDate: "2 days ago",
      tags: ["React", "Node.js", "TypeScript", "AWS"],
    },
    {
      id: 2,
      title: "Lead Frontend Engineer",
      company: "Innovation Labs",
      location: "Remote",
      salary: "$130K - $160K",
      type: "Full-time",
      matchScore: 92,
      postedDate: "1 week ago",
      tags: ["React", "Next.js", "TypeScript", "GraphQL"],
    },
    {
      id: 3,
      title: "Staff Software Engineer",
      company: "CloudScale Inc",
      location: "New York, NY",
      salary: "$160K - $200K",
      type: "Full-time",
      matchScore: 88,
      postedDate: "3 days ago",
      tags: ["Python", "Microservices", "Kubernetes", "AWS"],
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: "TechCorp Solutions",
      position: "Senior Full Stack Developer",
      date: "June 20, 2026",
      time: "2:00 PM",
      type: "Technical Interview",
      interviewer: "Sarah Johnson",
    },
    {
      id: 2,
      company: "Innovation Labs",
      position: "Lead Frontend Engineer",
      date: "June 22, 2026",
      time: "10:00 AM",
      type: "Cultural Fit",
      interviewer: "Michael Chen",
    },
  ];

  const applicationStatus = [
    { status: "Under Review", count: 5, color: "bg-blue-500" },
    { status: "Interview Scheduled", count: 3, color: "bg-green-500" },
    { status: "Offer Received", count: 1, color: "bg-primary" },
    { status: "Rejected", count: 3, color: "bg-red-500" },
  ];

  const skillGapSuggestions = [
    { skill: "System Design", importance: "High", progress: 60 },
    { skill: "Docker & Kubernetes", importance: "Medium", progress: 40 },
    { skill: "GraphQL", importance: "Medium", progress: 70 },
  ];

  return (
    <DashboardLayout role="job-seeker">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground">
            You have 3 upcoming interviews and 5 new job matches based on your profile
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Completion */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to get better matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Overall Progress</span>
                  <span className="text-sm font-bold text-primary">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Personal Information</p>
                    <p className="text-muted-foreground text-xs">Completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Work Experience</p>
                    <p className="text-muted-foreground text-xs">Completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Skills & Certifications</p>
                    <p className="text-muted-foreground text-xs">In Progress</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/job-seeker/profile")}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Track your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {applicationStatus.map((status, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                    <div className={`w-3 h-3 rounded-full ${status.color} mb-2`} />
                    <p className="text-2xl font-bold">{status.count}</p>
                    <p className="text-sm text-muted-foreground">{status.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Job Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle>AI Job Recommendations</CardTitle>
              </div>
              <Button variant="outline" onClick={() => navigate("/job-seeker/job-search")}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <CardDescription>
              Jobs matched to your skills and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiJobRecommendations.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer bg-card/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{job.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{job.postedDate}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {job.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Interviews</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/job-seeker/interviews")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{interview.position}</h4>
                      <p className="text-sm text-muted-foreground">{interview.company}</p>
                    </div>
                    <Badge>{interview.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {interview.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {interview.time}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    With {interview.interviewer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Suggestions</CardTitle>
              <CardDescription>
                Improve these skills to increase your job matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGapSuggestions.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <Badge
                        variant={skill.importance === "High" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {skill.importance}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View Learning Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
