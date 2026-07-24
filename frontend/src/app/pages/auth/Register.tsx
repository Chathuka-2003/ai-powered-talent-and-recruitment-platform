import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { setCurrentRole } from "../../auth";
import { api } from "../../api";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await api.auth.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      setCurrentRole("jobseeker");
      localStorage.setItem("talentai.user", JSON.stringify(response));
      toast.success("Candidate account created successfully! Welcome aboard.");
      navigate("/jobseeker/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
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
          <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#D4AF37]/15 rounded-full blur-[160px] pointer-events-none" />
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

        {/* Center Main Statement */}
        <div className="relative z-10 my-auto py-12 max-w-xl space-y-6">
          <p className="text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            CREATE CANDIDATE ACCOUNT
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Your career,{" "}
            <span className="font-serif italic text-[#D4AF37] font-normal">accelerating</span>{" "}
            with AI.
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md drop-shadow">
            Build your profile once, receive instant AI resume scoring, and get direct invitations to WebRTC HD video interview rooms from top companies.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Instant AI Skill Extraction & Profile Scoring",
              "Direct Invites to WebRTC HD Video Interviews",
              "Personalized AI Career & Salary Insights",
              "Real-time Application Status Tracker"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-gray-200 drop-shadow">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left Footer */}
        <div className="relative z-10 text-xs text-gray-400 flex items-center justify-between border-t border-white/10 pt-6">
          <span>© 2026 TalentAI Technologies Inc.</span>
          <span className="flex items-center gap-1 text-[#D4AF37] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Free Candidate Account
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

        <div className="w-full max-w-md space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Create Candidate Account
            </h2>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#D4AF37] font-bold hover:underline"
                onClick={() => navigate("/jobseeker/login")}
              >
                Sign in to Candidate Portal
              </button>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-bold text-foreground">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="pl-10 bg-secondary/40 border-white/10 text-foreground text-sm h-11 focus:border-[#D4AF37] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-bold text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="bg-secondary/40 border-white/10 text-foreground text-sm h-11 focus:border-[#D4AF37] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10 bg-secondary/40 border-white/10 text-foreground text-sm h-11 focus:border-[#D4AF37] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 pr-9 bg-secondary/40 border-white/10 text-foreground text-sm h-11 focus:border-[#D4AF37] rounded-xl"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pl-10 bg-secondary/40 border-white/10 text-foreground text-sm h-11 focus:border-[#D4AF37] rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 h-12 text-base rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Candidate Account"
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By registering, you agree to our{" "}
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
