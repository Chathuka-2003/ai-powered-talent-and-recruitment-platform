import { Button } from "../components/ui/button";
import { GlassCard } from "../components/GlassCard";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Brain,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Target,
  Star,
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
  UserRoundSearch,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match candidates with the perfect opportunities based on skills, experience, and cultural fit.",
    },
    {
      icon: Zap,
      title: "Automated Screening",
      description: "Save time with intelligent resume parsing and automatic candidate ranking based on job requirements.",
    },
    {
      icon: Users,
      title: "Talent Pool Management",
      description: "Build and maintain a database of qualified candidates for current and future hiring needs.",
    },
    {
      icon: Target,
      title: "Smart Job Recommendations",
      description: "Job seekers receive personalized job recommendations powered by machine learning algorithms.",
    },
    {
      icon: Clock,
      title: "Interview Scheduling",
      description: "Streamline interview coordination with automated scheduling and calendar integration.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to protect sensitive candidate information.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Jobs" },
    { value: "200K+", label: "Candidates" },
    { value: "10K+", label: "Companies" },
    { value: "95%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director, Tech Corp",
      content: "TalentAI reduced our hiring time by 60%. The AI matching is incredibly accurate.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Recruiting Manager, StartupXYZ",
      content: "Best recruitment platform we've used. The candidate quality has improved dramatically.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Talent Acquisition Lead",
      content: "The AI-powered screening saves us countless hours. Highly recommended!",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Portal",
      description: "Job seekers enter the candidate experience, while employees sign in through secure company access.",
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our AI analyzes resumes, job requirements, and matches candidates automatically.",
    },
    {
      step: "03",
      title: "Smart Matching",
      description: "Get ranked candidates or job recommendations based on compatibility scores.",
    },
    {
      step: "04",
      title: "Seamless Hiring",
      description: "Schedule interviews, communicate, and make hiring decisions all in one platform.",
    },
  ];

  const portals = [
    {
      icon: UserRoundSearch,
      title: "Job Seeker",
      description: "Search jobs, manage your resume, track applications, and receive AI-powered recommendations.",
      primaryLabel: "Continue as Job Seeker",
      primaryPath: "/jobseeker/login",
      secondaryLabel: "Create Job Seeker Account",
      secondaryPath: "/jobseeker/register",
    },
    {
      icon: BriefcaseBusiness,
      title: "Employee",
      description: "Sign in once. TalentAI verifies your assigned employee role and opens the right workspace.",
      primaryLabel: "Employee Login",
      primaryPath: "/employee/login",
      secondaryLabel: "Use Company Credentials",
      secondaryPath: "/employee/login",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-[#D4AF37]" />
              <span className="text-2xl font-bold text-foreground">TalentAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/jobseeker/login")}>
                Job Seeker
              </Button>
              <Button onClick={() => navigate("/employee/login")}>Employee</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-border mb-6">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37]">AI-Powered Recruitment Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="text-[#D4AF37]"> Hiring Process</span> with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Enterprise-grade recruitment platform that automates candidate screening, job matching,
              and hiring decisions with advanced artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" onClick={() => navigate("/jobseeker/login")}>
                Job Seeker <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/employee/login")}>
                Employee Login
              </Button>
            </div>
          </div>
          <div className="relative">
            <GlassCard className="p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-[#D4AF37]/20 p-3">
                    <Brain className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI Matching Score</p>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-[#D4AF37] to-[#E5C158]" />
                </div>
                <div className="pt-4 space-y-3">
                  {["Machine Learning Engineer", "Senior Data Scientist", "AI Product Manager"].map((role, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-foreground">{role}</span>
                      <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <GlassCard key={portal.title} className="p-8 hover:border-[#D4AF37]/40 transition-colors">
                <div className="rounded-lg bg-[#D4AF37]/10 p-4 w-fit mb-5">
                  <Icon className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">{portal.title}</h2>
                <p className="text-muted-foreground min-h-20">{portal.description}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" onClick={() => navigate(portal.primaryPath)}>
                    {portal.primaryLabel}
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => navigate(portal.secondaryPath)}>
                    {portal.secondaryLabel}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6 text-center">
              <h3 className="text-4xl font-bold text-[#D4AF37] mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need for modern recruitment</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={index} className="p-6 hover:border-[#D4AF37]/40 transition-colors">
                <div className="rounded-lg bg-[#D4AF37]/10 p-3 w-fit mb-4">
                  <Icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How TalentAI Works</h2>
          <p className="text-xl text-muted-foreground">Simple, powerful, and effective</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-bold text-[#D4AF37]/20 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-muted-foreground">See what our customers say</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <GlassCard className="p-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of companies using TalentAI to find and hire the best talent faster.
          </p>
          <Button size="lg" className="text-lg" onClick={() => navigate("/jobseeker/register")}>
            Create Job Seeker Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-xl font-bold text-foreground">TalentAI</span>
            </div>
            <p className="text-muted-foreground">© 2026 TalentAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
