import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GlassCard } from "../../components/GlassCard";
import { useNavigate } from "react-router";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password reset link sent to your email!");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>

        <GlassCard className="p-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-10 w-10 text-[#D4AF37] mr-3" />
            <h1 className="text-3xl font-bold text-foreground">TalentAI</h1>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Forgot Password?</h2>
          <p className="text-muted-foreground mb-8 text-center">
            Enter your email and we'll send you a reset link
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
