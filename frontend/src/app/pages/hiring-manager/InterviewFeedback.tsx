import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Eye } from "lucide-react";

export function InterviewFeedback() {
  const feedbacks = [
    { id: 1, candidate: "Alice Johnson", position: "Senior React Developer", interviewer: "You", date: "June 17, 2026", status: "Submitted" },
    { id: 2, candidate: "Bob Smith", position: "Full Stack Engineer", interviewer: "You", date: "June 15, 2026", status: "Pending" },
  ];

  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Interview Feedback</h1>
        <p className="text-muted-foreground">Submit and review interview feedback</p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <GlassCard key={feedback.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{feedback.candidate}</h3>
                <p className="text-muted-foreground mb-2">{feedback.position}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Interviewer: {feedback.interviewer}</span>
                  <span>Date: {feedback.date}</span>
                  <Badge variant={feedback.status === "Submitted" ? "default" : "outline"}>
                    {feedback.status}
                  </Badge>
                </div>
              </div>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Feedback
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
