import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GlassCard } from "../../components/GlassCard";
import { useNavigate } from "react-router";
import { Sparkles, Lock } from "lucide-react";
import { toast } from "sonner";

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password reset successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard className="p-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-10 w-10 text-[#D4AF37] mr-3" />
            <h1 className="text-3xl font-bold text-foreground">TalentAI</h1>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Reset Password</h2>
          <p className="text-muted-foreground mb-8 text-center">Enter your new password</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Reset Password
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
