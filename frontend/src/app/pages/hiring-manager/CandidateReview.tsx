import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { FileText, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";

export function CandidateReview() {
  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Review</h1>
        <p className="text-muted-foreground">Review candidate profile and qualifications</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Alice Johnson</h2>
              <p className="text-xl text-muted-foreground mb-4">Senior React Developer</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>alice.johnson@email.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "AWS", "Docker", "GraphQL"].map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="font-semibold text-foreground">Experience</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-foreground">Senior Frontend Developer</h4>
                  <p className="text-[#D4AF37]">Tech Corp • 2022 - Present</p>
                  <p className="text-muted-foreground mt-2 text-sm">Led development of React-based applications</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="font-semibold text-foreground">Education</h3>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-semibold text-foreground">BS Computer Science</h4>
                <p className="text-[#D4AF37]">Stanford University • 2015 - 2019</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-foreground mb-4">AI Match Score</h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[#D4AF37]">98%</div>
              <p className="text-sm text-muted-foreground">Overall Match</p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Skills</span>
                  <span className="text-foreground">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="text-foreground">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Actions</h3>
            <div className="space-y-2">
              <Button className="w-full">Approve for Interview</Button>
              <Button variant="outline" className="w-full">Request More Info</Button>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Resume
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
