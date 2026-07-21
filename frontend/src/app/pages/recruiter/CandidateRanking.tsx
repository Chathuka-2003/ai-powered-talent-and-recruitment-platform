import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Trophy, Target, Brain, CheckCircle } from "lucide-react";

export default function CandidateRanking() {
  const rankedCandidates = [
    { rank: 1, name: "Alex Thompson", job: "Senior Developer", overall: 96, skills: 98, experience: 95, education: 94 },
    { rank: 2, name: "Jessica Lee", job: "Frontend Engineer", overall: 94, skills: 96, experience: 92, education: 94 },
    { rank: 3, name: "Robert Martinez", job: "DevOps Engineer", overall: 92, skills: 94, experience: 90, education: 92 },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Candidate Ranking</h1>
          </div>
          <p className="text-muted-foreground">Candidates automatically ranked by AI based on job requirements</p>
        </div>

        <div className="space-y-4">
          {rankedCandidates.map((candidate) => (
            <Card key={candidate.rank} className={`hover:border-primary/50 transition-all ${candidate.rank === 1 ? 'border-primary/50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${candidate.rank === 1 ? 'bg-primary/20' : 'bg-muted'}`}>
                    {candidate.rank === 1 ? (
                      <Trophy className="w-8 h-8 text-primary" />
                    ) : (
                      <span className="text-2xl font-bold">{candidate.rank}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          {candidate.rank === 1 && <Badge className="bg-primary">Top Match</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{candidate.job}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-5 h-5 text-primary" />
                          <span className="text-3xl font-bold text-primary">{candidate.overall}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Overall Match</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Skills Match</span>
                          <span className="font-semibold">{candidate.skills}%</span>
                        </div>
                        <Progress value={candidate.skills} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Experience</span>
                          <span className="font-semibold">{candidate.experience}%</span>
                        </div>
                        <Progress value={candidate.experience} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Education</span>
                          <span className="font-semibold">{candidate.education}%</span>
                        </div>
                        <Progress value={candidate.education} />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">View Full Profile</Button>
                      <Button variant="outline">Contact Candidate</Button>
                      <Button variant="outline">Schedule Interview</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
