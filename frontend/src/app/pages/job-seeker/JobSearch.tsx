import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import {
  Search,
  MapPin,
  Building,
  DollarSign,
  Briefcase,
  Clock,
  Bookmark,
  Filter,
  Sparkles,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const jobListings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      salary: "$140K - $180K",
      type: "Full-time",
      experience: "5+ years",
      matchScore: 95,
      postedDate: "2 days ago",
      description: "We're looking for an experienced Full Stack Developer to join our engineering team...",
      requirements: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
      benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
    },
    {
      id: 2,
      title: "Lead Frontend Engineer",
      company: "Innovation Labs",
      location: "Remote",
      salary: "$130K - $160K",
      type: "Full-time",
      experience: "6+ years",
      matchScore: 92,
      postedDate: "1 week ago",
      description: "Join our team as a Lead Frontend Engineer and help build the next generation...",
      requirements: ["React", "Next.js", "TypeScript", "GraphQL", "CSS"],
      benefits: ["Remote Work", "Health Insurance", "Flexible Hours", "Learning Budget"],
    },
    {
      id: 3,
      title: "Staff Software Engineer",
      company: "CloudScale Inc",
      location: "New York, NY",
      salary: "$160K - $200K",
      type: "Full-time",
      experience: "8+ years",
      matchScore: 88,
      postedDate: "3 days ago",
      description: "Looking for a Staff Engineer to lead technical initiatives and mentor the team...",
      requirements: ["Python", "Microservices", "Kubernetes", "AWS", "Docker"],
      benefits: ["Relocation Assistance", "Health Insurance", "Stock Options", "Gym Membership"],
    },
    {
      id: 4,
      title: "Senior React Developer",
      company: "StartupX",
      location: "Austin, TX",
      salary: "$120K - $150K",
      type: "Full-time",
      experience: "4+ years",
      matchScore: 85,
      postedDate: "5 days ago",
      description: "Build amazing user interfaces and experiences for our growing platform...",
      requirements: ["React", "JavaScript", "CSS", "REST APIs", "Git"],
      benefits: ["Startup Equity", "Health Insurance", "Unlimited PTO", "Remote Option"],
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "Enterprise Corp",
      location: "Chicago, IL",
      salary: "$130K - $170K",
      type: "Full-time",
      experience: "5+ years",
      matchScore: 80,
      postedDate: "1 week ago",
      description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines...",
      requirements: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
      benefits: ["Health Insurance", "401k Match", "Bonus", "Training Budget"],
    },
  ];

  const toggleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast.success("Job removed from saved");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully");
    }
  };

  return (
    <DashboardLayout role="job-seeker">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Job Search</h1>
          <p className="text-muted-foreground">
            Find your next opportunity with AI-powered job matching
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keywords..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <Button className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              <Separator className="my-4" />

              {/* Job Type */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-semibold">Job Type</Label>
                <div className="space-y-2">
                  {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-sm cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Experience Level */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-semibold">Experience Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              {/* Salary Range */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-semibold">Salary Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50">$0 - $50K</SelectItem>
                    <SelectItem value="50-100">$50K - $100K</SelectItem>
                    <SelectItem value="100-150">$100K - $150K</SelectItem>
                    <SelectItem value="150-200">$150K - $200K</SelectItem>
                    <SelectItem value="200+">$200K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              {/* Remote Work */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Work Location</Label>
                <div className="space-y-2">
                  {["Remote", "Hybrid", "On-site"].map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={loc} />
                      <label htmlFor={loc} className="text-sm cursor-pointer">
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{jobListings.length}</span> jobs
              </p>
              <Select defaultValue="match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {jobListings.map((job) => (
              <Card key={job.id} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.postedDate}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveJob(job.id)}
                      className={savedJobs.includes(job.id) ? "text-destructive" : ""}
                    >
                      <Heart
                        className={`w-5 h-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
