import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { FileText, Upload, Download, Sparkles, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { toast } from "sonner";

export default function JobSeekerResume() {
  const handleUpload = () => {
    toast.success("Resume uploaded successfully!");
  };

  const aiAnalysis = [
    { category: "Format & Structure", score: 95, status: "excellent" },
    { category: "Keywords Optimization", score: 82, status: "good" },
    { category: "Experience Description", score: 88, status: "good" },
    { category: "Skills Alignment", score: 75, status: "needs-improvement" },
  ];

  const extractedSkills = ["React", "TypeScript", "Node.js", "AWS", "Docker", "MongoDB", "GraphQL", "Python"];
  const suggestedSkills = ["Kubernetes", "Terraform", "Redis", "PostgreSQL"];

  return (
    <DashboardLayout role="job-seeker">
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
          <p className="text-muted-foreground">Upload and optimize your resume with AI-powered analysis</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>Upload your resume in PDF or DOCX format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Click to upload or drag and drop</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF or DOCX (max. 5MB)</p>
                <Button onClick={handleUpload}>Select File</Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Resume History</h4>
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">John_Doe_Resume_v{i}.pdf</p>
                        <p className="text-xs text-muted-foreground">Uploaded on June {15 + i}, 2026</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Score</CardTitle>
              <CardDescription>AI-powered analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full border-8 border-primary/20 mx-auto flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">85</div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Good Score
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>ATS Compatibility</span>
                  <span className="font-semibold">92%</span>
                </div>
                <Progress value={92} />
                <div className="flex items-center justify-between text-sm">
                  <span>Keyword Match</span>
                  <span className="font-semibold">78%</span>
                </div>
                <Progress value={78} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Resume Analysis</CardTitle>
            <CardDescription>Detailed breakdown of your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {aiAnalysis.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    {item.status === "excellent" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : item.status === "needs-improvement" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <Progress value={item.score} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{item.score}/100</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Skills</CardTitle>
              <CardDescription>Skills found in your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill) => (
                  <Badge key={skill} className="bg-primary/20 text-primary border-primary/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Skills</CardTitle>
              <CardDescription>Add these to improve your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-primary/10">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
