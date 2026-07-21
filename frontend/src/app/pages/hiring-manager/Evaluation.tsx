import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Slider } from "../../components/ui/slider";
import { toast } from "sonner";

export function Evaluation() {
  const handleSubmit = () => {
    toast.success("Evaluation submitted successfully!");
  };

  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Evaluation</h1>
        <p className="text-muted-foreground">Provide detailed evaluation and ratings</p>
      </div>

      <GlassCard className="p-6 max-w-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Evaluate: Alice Johnson</h2>
        <div className="space-y-6">
          {["Technical Skills", "Problem Solving", "Communication", "Cultural Fit", "Leadership"].map((criteria) => (
            <div key={criteria} className="space-y-2">
              <Label className="text-foreground">{criteria}</Label>
              <Slider defaultValue={[8]} max={10} step={1} className="my-4" />
            </div>
          ))}

          <div className="space-y-2">
            <Label className="text-foreground">Overall Comments</Label>
            <Textarea
              placeholder="Enter your evaluation notes..."
              rows={6}
              className="bg-card border-border text-foreground resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSubmit}>Submit Evaluation</Button>
            <Button variant="outline">Save Draft</Button>
          </div>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
