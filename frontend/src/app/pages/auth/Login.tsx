import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GlassCard } from "../../components/GlassCard";
import { useNavigate } from "react-router";
import { Sparkles, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { dashboardByRole, setCurrentRole, type AuthAudience, type UserRole } from "../../auth";
import { api } from "../../api";

export function Login({ audience = "employee" }: { audience?: AuthAudience }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isJobSeeker = audience === "jobseeker";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.auth.login(email, password);
      let roleStr = response.role.toLowerCase();
      if (roleStr === "hiringmanager") roleStr = "hiring-manager";
      const role = roleStr as UserRole;
      response.role = roleStr;
      
      setCurrentRole(role);
      localStorage.setItem("talentai.user", JSON.stringify(response));
      
      toast.success(isJobSeeker ? "Login successful. Redirecting to your dashboard." : "Login successful. Redirecting based on your assigned role.");
      navigate(dashboardByRole[role]);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <GlassCard className="p-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-10 w-10 text-[#D4AF37] mr-3" />
            <h1 className="text-3xl font-bold text-foreground">TalentAI</h1>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">
            {isJobSeeker ? "Job Seeker Login" : "Employee Login"}
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
            {isJobSeeker
              ? "Sign in to manage your profile, applications, interviews, and recommendations."
              : "Sign in with your company credentials. TalentAI verifies your database role and routes you automatically."}
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isJobSeeker ? "you@email.com" : "you@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Button
                type="button"
                variant="link"
                className="text-[#D4AF37] p-0 h-auto"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isJobSeeker ? "Sign In as Job Seeker" : "Sign In as Employee"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isJobSeeker ? (
                <>
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="text-[#D4AF37] p-0 h-auto"
                    onClick={() => navigate("/jobseeker/register")}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 items-center">
                  <div>
                    Don't have an employer account?{" "}
                    <Button
                      variant="link"
                      className="text-[#D4AF37] p-0 h-auto font-semibold"
                      onClick={() => navigate("/recruiter/register")}
                    >
                      Register here
                    </Button>
                  </div>
                  <div>
                    Looking for jobs?{" "}
                    <Button
                      variant="link"
                      className="text-[#D4AF37] p-0 h-auto"
                      onClick={() => navigate("/jobseeker/login")}
                    >
                      Use Job Seeker Login
                    </Button>
                  </div>
                </div>
              )}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
