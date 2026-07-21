import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Sparkles, Trophy, Star, TrendingUp, Award } from "lucide-react";

export function AICandidateRanking() {
  const rankedCandidates = [
    {
      id: 1,
      rank: 1,
      name: "Alice Johnson",
      position: "Senior React Developer",
      overallScore: 98,
      scores: { skills: 98, experience: 96, education: 95, cultural: 92 },
      aiInsights: ["Perfect technical skills match", "Relevant industry experience", "Strong leadership potential"],
    },
    {
      id: 2,
      rank: 2,
      name: "Bob Smith",
      position: "Senior React Developer",
      overallScore: 95,
      scores: { skills: 94, experience: 98, education: 92, cultural: 90 },
      aiInsights: ["Extensive experience in similar roles", "Strong problem-solving skills", "Team player"],
    },
    {
      id: 3,
      rank: 3,
      name: "Carol Williams",
      position: "Senior React Developer",
      overallScore: 92,
      scores: { skills: 90, experience: 92, education: 96, cultural: 88 },
      aiInsights: ["Top university graduate", "Quick learner", "Adaptable to new technologies"],
    },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="h-8 w-8 text-[#D4AF37]" />
          <h1 className="text-3xl font-bold text-foreground">AI Candidate Ranking</h1>
        </div>
        <p className="text-muted-foreground">AI-powered candidate matching and ranking for your job openings</p>
      </div>

      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Job: Senior React Developer</h2>
            <p className="text-muted-foreground">{rankedCandidates.length} candidates ranked by AI</p>
          </div>
          <Button variant="outline">Change Job</Button>
        </div>
      </GlassCard>

      <div className="space-y-6">
        {rankedCandidates.map((candidate) => (
          <GlassCard key={candidate.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className={`rounded-full ${candidate.rank === 1 ? 'bg-[#D4AF37]' : 'bg-secondary'} h-12 w-12 flex items-center justify-center`}>
                  {candidate.rank === 1 ? (
                    <Trophy className="h-6 w-6 text-black" />
                  ) : (
                    <span className="text-xl font-bold text-foreground">#{candidate.rank}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{candidate.name}</h3>
                  <p className="text-muted-foreground">{candidate.position}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#D4AF37] mb-1">{candidate.overallScore}%</div>
                <p className="text-sm text-muted-foreground">Overall Match</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {Object.entries(candidate.scores).map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{category}</span>
                    <span className="text-sm font-semibold text-foreground">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-5 w-5 text-[#D4AF37]" />
                <h4 className="font-semibold text-foreground">AI Insights</h4>
              </div>
              <ul className="space-y-2">
                {candidate.aiInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <TrendingUp className="h-4 w-4 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-3">
              <Button>View Full Profile</Button>
              <Button variant="outline">Schedule Interview</Button>
              <Button variant="outline">Send Message</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
