import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Building,
  UserCheck,
  Zap,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { dashboardByRole, isRoleAllowedForAudience, setCurrentRole, type AuthAudience, type UserRole } from "../../auth";
import { api } from "../../api";

export function Login({ audience = "employee" }: { audience?: AuthAudience }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthAudience>(audience);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const isJobSeeker = activeTab === "jobseeker";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.login(email, password);
      let roleStr = response.role.toLowerCase();
      if (roleStr === "hiringmanager") roleStr = "hiring-manager";
      const role = roleStr as UserRole;
      response.role = roleStr;

      if (!isRoleAllowedForAudience(role, activeTab)) {
        if (isJobSeeker) {
          toast.error("This account is an Employee account. Switching to Employee portal...");
          setActiveTab("employee");
        } else {
          toast.error("This account is a Job Seeker account. Switching to Job Seeker portal...");
          setActiveTab("jobseeker");
        }
        setLoading(false);
        return;
      }
      
      setCurrentRole(role);
      localStorage.setItem("talentai.user", JSON.stringify(response));
      
      toast.success(isJobSeeker ? "Welcome back! Redirecting to your candidate dashboard." : `Welcome back! Signed in as ${role.toUpperCase()}.`);
      navigate(dashboardByRole[role]);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoRole: UserRole, targetAudience: AuthAudience) => {
    setActiveTab(targetAudience);
    setEmail(demoEmail);
    setPassword("Password123!");
    toast.info(`Pre-filled ${demoRole.toUpperCase()} credentials. Click 'Sign in' to proceed.`);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0C] text-foreground grid lg:grid-cols-2 overflow-x-hidden">
      
      {/* LEFT HALF: 50% Viewport Background Image + Dark Vignette & Statement Typography */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 border-r border-white/10 overflow-hidden group">
        
        {/* Full-bleed Hero Cover Image Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://static.wixstatic.com/media/a38016_f1a0351c757240998e0fd8a3a8c10f1b.jpg/v1/fill/w_640,h_538,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/a38016_f1a0351c757240998e0fd8a3a8c10f1b.jpg"
            alt="Employment Opportunities & Hiring Background"
            className="w-full h-full object-cover brightness-[0.32] contrast-110 scale-105 transform group-hover:scale-110 transition-transform duration-1000"
          />
          {/* Luxury Dark Vignette Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/75 to-[#0A0A0C]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/90 via-black/40 to-transparent" />
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#D4AF37]/15 rounded-full blur-[160px] pointer-events-none" />
        </div>

        {/* Top Header & Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#D4AF37]/20">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Talent<span className="text-[#D4AF37]">AI</span></span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white text-xs bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 rounded-xl"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Website
          </Button>
        </div>

        {/* Center Main Statement (Reference Screenshot Typography Style) */}
        <div className="relative z-10 my-auto py-12 max-w-xl space-y-6">
          <p className="text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            WELCOME BACK
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Your hiring,{" "}
            <span className="font-serif italic text-[#D4AF37] font-normal">flowing</span>{" "}
            as it should.
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md drop-shadow">
            TalentAI connects candidate applications, AI candidate match scoring, and HD video interview rooms in one place. Less switching, more hiring.
          </p>

          {/* Floating Glassmorphism Metric Pill */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl text-xs font-semibold text-white shadow-2xl">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>AI Match Scoring & WebRTC Video Call Engine Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer Tag */}
        <div className="relative z-10 text-xs text-gray-400 flex items-center justify-between border-t border-white/10 pt-6">
          <span>© 2026 TalentAI Technologies Inc.</span>
          <span className="flex items-center gap-1 text-[#D4AF37] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
          </span>
        </div>
      </div>


      {/* RIGHT HALF: 50% Viewport Auth Form Area */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-[#0A0A0C] relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-extrabold">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="text-lg font-extrabold text-foreground">Talent<span className="text-[#D4AF37]">AI</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs">
            <ArrowLeft className="mr-1 h-3 w-3" /> Home
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8">
          
          {/* Main Title & Subtitle (Reference Image Style) */}
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Sign in to TalentAI
            </h2>
            <p className="text-sm text-muted-foreground">
              No account yet?{" "}
              <button
                type="button"
                className="text-[#D4AF37] font-bold hover:underline"
                onClick={() => navigate(isJobSeeker ? "/jobseeker/register" : "/recruiter/register")}
              >
                Start free for candidates & employers
              </button>
            </p>
          </div>

          {/* Quick SSO & Demo Login Shortcut Pills */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">1-Click Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-secondary/60 border border-white/10 hover:border-[#D4AF37]/50 text-left transition-all text-xs hover:bg-[#D4AF37]/10 flex items-center gap-2 group"
                onClick={() => handleDemoFill("chathuka.edirisinghe@gmail.com", "jobseeker", "jobseeker")}
              >
                <UserCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-foreground group-hover:text-[#D4AF37]">Candidate</p>
                  <p className="text-[10px] text-muted-foreground truncate">Chathuka E.</p>
                </div>
              </button>

              <button
                type="button"
                className="p-2.5 rounded-xl bg-secondary/60 border border-white/10 hover:border-[#D4AF37]/50 text-left transition-all text-xs hover:bg-[#D4AF37]/10 flex items-center gap-2 group"
                onClick={() => handleDemoFill("recruiter.ifs@talentai.com", "recruiter", "employee")}
              >
                <Building className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-foreground group-hover:text-[#D4AF37]">Recruiter</p>
                  <p className="text-[10px] text-muted-foreground truncate">Kavishi R.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0A0A0C] px-3 text-[11px] text-muted-foreground uppercase tracking-widest shrink-0">
              or continue with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Portal Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-secondary/40 rounded-xl border border-white/10">
            <button
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${isJobSeeker ? "bg-[#D4AF37] text-black shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab("jobseeker")}
            >
              Job Seeker Portal
            </button>
            <button
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${!isJobSeeker ? "bg-[#D4AF37] text-black shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab("employee")}
            >
              Company / Employee
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isJobSeeker ? "chathuka.edirisinghe@gmail.com" : "you@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/40 border-white/10 text-foreground text-sm h-12 focus:border-[#D4AF37] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/40 border-white/10 text-foreground text-sm h-12 focus:border-[#D4AF37] rounded-xl"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password (Exact Reference Layout) */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="rounded border-white/20 bg-secondary/50 text-[#D4AF37] focus:ring-0 w-4 h-4"
                />
                <span className="text-muted-foreground">Keep me signed in</span>
              </label>

              <button
                type="button"
                className="text-[#D4AF37] font-semibold hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Main Primary Button (Gold Color Preserved) */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 h-12 text-base rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Reference Footer Disclaimer */}
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="text-gray-400 underline hover:text-foreground">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-gray-400 underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
