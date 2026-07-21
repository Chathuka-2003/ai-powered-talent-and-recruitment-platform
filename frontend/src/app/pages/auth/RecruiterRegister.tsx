import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GlassCard } from "../../components/GlassCard";
import { useNavigate } from "react-router";
import { Sparkles, Mail, Lock, User, Building, Briefcase, Phone, ArrowLeft, Layers } from "lucide-react";
import { toast } from "sonner";
import { setCurrentRole } from "../../auth";
import { api } from "../../api";

export function RecruiterRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    jobTitle: "",
    department: "",
    phoneNumber: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await api.auth.registerRecruiter(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.companyName,
        formData.jobTitle,
        formData.department,
        formData.phoneNumber
      );
      
      setCurrentRole("recruiter");
      localStorage.setItem("talentai.user", JSON.stringify(response));
      toast.success("Recruiter account created successfully!");
      navigate("/recruiter/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create recruiter account.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <GlassCard className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-10 w-10 text-[#D4AF37] mr-3" />
            <h1 className="text-3xl font-bold text-foreground">TalentAI</h1>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Recruiter & Employer Registration</h2>
          <p className="text-muted-foreground mb-8 text-center">Create your employer account to start posting jobs and sourcing candidates with AI.</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-border pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Connor"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="bg-card border-border text-foreground focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-border pb-2 pt-4">Company Details</h3>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-foreground">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="companyName"
                  placeholder="Cyberdyne Systems"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-foreground">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="jobTitle"
                    placeholder="Senior Tech Recruiter"
                    value={formData.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground">Department</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="department"
                    placeholder="Human Resources / Talent Acquisition"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-border pb-2 pt-4">Password Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
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
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pl-10 bg-card border-border text-foreground focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6 bg-[#D4AF37] text-black hover:bg-[#E5C158]" size="lg">
              Create Employer Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-[#D4AF37] p-0 h-auto text-sm"
                onClick={() => navigate("/employee/login")}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
