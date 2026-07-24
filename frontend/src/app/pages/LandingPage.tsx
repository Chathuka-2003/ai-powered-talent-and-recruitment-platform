import { Button } from "../components/ui/button";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/ThemeToggle";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Brain,
  Users,
  Shield,
  Zap,
  Clock,
  Target,
  Star,
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
  UserRoundSearch,
  Phone,
  PhoneCall,
  MessageCircle,
  MapPin,
  Mail,
  Globe
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const phoneNumber = "0770522297";
  const whatsappUrl = "https://wa.me/94770522297?text=Hello%20TalentAI%20Team%2C%20I%20have%20an%20inquiry%20regarding%20the%20platform.";
  const callUrl = "tel:0770522297";

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
      title: "HD Video Interview Rooms",
      description: "Streamline interview coordination with integrated WebRTC video rooms and live online presence.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to protect sensitive candidate and company information.",
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
      content: "TalentAI reduced our hiring time by 60%. The AI candidate scoring is incredibly accurate.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Recruiting Manager, StartupXYZ",
      content: "Best recruitment platform we've used. The WebRTC video interview room works flawlessly.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Talent Acquisition Lead",
      content: "The AI-powered screening saves us countless hours. Highly recommended for modern hiring teams!",
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
      description: "Schedule interviews, host video calls, evaluate candidates, and make hiring decisions all in one platform.",
    },
  ];

  const portals = [
    {
      icon: UserRoundSearch,
      title: "Job Seeker Portal",
      description: "Search jobs, manage your profile, track applications, and receive AI-powered recommendations.",
      primaryLabel: "Job Seeker Login",
      primaryPath: "/jobseeker/login",
      secondaryLabel: "Register Account",
      secondaryPath: "/jobseeker/register",
    },
    {
      icon: BriefcaseBusiness,
      title: "Company & Employer Portal",
      description: "Sign in with your business email. TalentAI verifies your role (Recruiter, Hiring Manager, Admin) automatically.",
      primaryLabel: "Employee Sign In",
      primaryPath: "/employee/login",
      secondaryLabel: "Register Company",
      secondaryPath: "/recruiter/register",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-foreground">
      


      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0A0A0C]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#D4AF37]/20">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <span className="text-2xl font-extrabold text-foreground tracking-tight">Talent<span className="text-[#D4AF37]">AI</span></span>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>

              <Button
                variant="ghost"
                className="text-xs sm:text-sm font-semibold"
                onClick={() => navigate("/jobseeker/login")}
              >
                Job Seeker Portal
              </Button>
              <Button
                className="bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 text-xs sm:text-sm rounded-xl px-4"
                onClick={() => navigate("/employee/login")}
              >
                Company Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Custom Image Integration */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Contact CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-3.5 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> AI-Powered Talent & Recruitment Platform
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight">
                Empowering the Future of <span className="text-[#D4AF37]">Smart Recruitment</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Enterprise recruitment platform automating candidate scoring, resume parsing, HD WebRTC video interviews, and talent acquisition workflows.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 h-12 px-6 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-sm flex items-center gap-2"
                  onClick={() => navigate("/jobseeker/login")}
                >
                  Explore Candidate Portal <ArrowRight className="h-4 w-4" />
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-600/30 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Chat on WhatsApp ({phoneNumber})
                </a>

                <a
                  href={callUrl}
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-secondary/80 text-foreground border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#D4AF37]" /> Call {phoneNumber}
                </a>
              </div>

              {/* Bullet Features */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> AI Resume Scoring Engine
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Live WebRTC Video Rooms
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Headquartered in Colombo
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Direct Call: {phoneNumber}
                </div>
              </div>
            </div>

            {/* Right Column: User-provided Employment Artwork Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-[#D4AF37]/15 group bg-secondary/40 backdrop-blur-2xl p-3">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="https://static.wixstatic.com/media/a38016_f1a0351c757240998e0fd8a3a8c10f1b.jpg/v1/fill/w_640,h_538,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/a38016_f1a0351c757240998e0fd8a3a8c10f1b.jpg"
                    alt="Employment Opportunities & Hiring Platform"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      GLOBAL RECRUITMENT NETWORK
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">Employment & Career Opportunities</h3>
                    <p className="text-xs text-gray-300">Connecting qualified talent with premier Sri Lankan and global enterprise employers.</p>
                  </div>
                </div>

                {/* Floating Stats Badge */}
                <div className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#D4AF37]" />
                  <span>98% AI Match Score</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-foreground mb-2">Select Your Access Portal</h2>
          <p className="text-sm text-muted-foreground">Dedicated workspaces tailored for job seekers and corporate hiring teams.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <GlassCard key={portal.title} className="p-8 border-white/10 bg-secondary/30 hover:border-[#D4AF37]/50 transition-all rounded-3xl">
                <div className="rounded-2xl bg-[#D4AF37]/15 p-4 w-fit mb-5 text-[#D4AF37]">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{portal.title}</h3>
                <p className="text-muted-foreground text-sm min-h-[60px] leading-relaxed">{portal.description}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 h-11 rounded-xl text-xs" onClick={() => navigate(portal.primaryPath)}>
                    {portal.primaryLabel}
                  </Button>
                  <Button className="flex-1 border-white/10 hover:bg-white/10 h-11 rounded-xl text-xs" variant="outline" onClick={() => navigate(portal.secondaryPath)}>
                    {portal.secondaryLabel}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6 text-center border-white/10 bg-secondary/30 rounded-2xl">
              <h3 className="text-4xl font-extrabold text-[#D4AF37] mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Enterprise Recruitment Features</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">Everything candidate and hiring teams need to streamline the talent pipeline.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={index} className="p-6 border-white/10 bg-secondary/30 hover:border-[#D4AF37]/40 transition-all rounded-2xl">
                <div className="rounded-xl bg-[#D4AF37]/15 p-3 w-fit mb-4 text-[#D4AF37]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Location Map & Contact Section (Colombo Location) */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Address & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <Badge className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 text-xs font-semibold rounded-full mb-3">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Colombo Headquarters
              </Badge>
              <h2 className="text-3xl font-extrabold text-foreground mb-3">Connect With Us in Colombo</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visit our Sri Lanka headquarters or reach out via direct phone line or WhatsApp for enterprise recruitment assistance.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 border border-white/10">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Office Location</h4>
                  <p className="text-xs text-gray-300">Level 12, West Tower, World Trade Center, Echelon Square, Colombo 01, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 border border-white/10">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Direct Call & Support</h4>
                  <a href={callUrl} className="text-sm font-bold text-[#D4AF37] hover:underline block">{phoneNumber}</a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mon - Fri: 8:30 AM - 6:00 PM (IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 border border-white/10">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Instant WhatsApp Support</h4>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-400 hover:underline block">
                    Chat on WhatsApp ({phoneNumber})
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">24/7 Candidate & Employer inquiries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map of Colombo */}
          <div className="lg:col-span-7">
            <GlassCard className="p-3 border-white/15 bg-secondary/30 rounded-3xl overflow-hidden shadow-2xl">
              <iframe
                title="TalentAI Colombo Office Location Map"
                src="https://maps.google.com/maps?q=World%20Trade%20Center%20Colombo%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-80 lg:h-[380px] rounded-2xl border border-white/10"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </GlassCard>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <GlassCard className="p-10 sm:p-14 text-center border-white/10 bg-gradient-to-r from-secondary/50 via-background to-secondary/50 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 relative z-10">Ready to Upgrade Your Recruitment?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-xl mx-auto relative z-10 leading-relaxed">
            Join candidates and top employers using TalentAI for smart resume scoring, WebRTC video calls, and automated hiring.
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Button size="lg" className="bg-[#D4AF37] text-black font-bold hover:bg-[#D4AF37]/90 h-12 px-8 rounded-xl text-sm shadow-lg shadow-[#D4AF37]/20" onClick={() => navigate("/jobseeker/register")}>
              Create Candidate Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all text-sm shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Contact Support on WhatsApp
            </a>
          </div>
        </GlassCard>
      </section>

      {/* Comprehensive Enterprise Footer */}
      <footer className="border-t border-white/10 bg-[#070709] pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Col 1: Brand & Contact Info (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#D4AF37]/20">
                  <Sparkles className="h-5 w-5 text-black" />
                </div>
                <span className="text-2xl font-extrabold text-foreground tracking-tight">Talent<span className="text-[#D4AF37]">AI</span></span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Next-generation recruitment platform powered by artificial intelligence, automated candidate ranking, and WebRTC video interview rooms.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <a href={callUrl} className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors">
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> Call Us: <strong className="text-foreground">{phoneNumber}</strong>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:underline">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp: <strong>{phoneNumber}</strong>
                </a>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" /> World Trade Center, Colombo 01, Sri Lanka
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links (3 Cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest text-[#D4AF37]">Platform Portals</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <button onClick={() => navigate("/jobseeker/login")} className="hover:text-foreground transition-colors">Job Seeker Portal</button>
                </li>
                <li>
                  <button onClick={() => navigate("/jobseeker/register")} className="hover:text-foreground transition-colors">Create Candidate Account</button>
                </li>
                <li>
                  <button onClick={() => navigate("/employee/login")} className="hover:text-foreground transition-colors">Company & Recruiter Sign In</button>
                </li>
                <li>
                  <button onClick={() => navigate("/recruiter/register")} className="hover:text-foreground transition-colors">Register Employer Account</button>
                </li>
                <li>
                  <button onClick={() => navigate("/interviews/video-room")} className="hover:text-foreground transition-colors">WebRTC Live Video Room</button>
                </li>
              </ul>
            </div>

            {/* Col 3: Key Features (3 Cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest text-[#D4AF37]">Key Features</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>AI Candidate Match Scoring</li>
                <li>Automated Resume Parsing</li>
                <li>Hiring Manager Candidate Evaluation</li>
                <li>Recruiter Talent Pipeline Tracking</li>
                <li>256-Bit SSL Data Encryption</li>
              </ul>
            </div>

            {/* Col 4: Quick Contact Button (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest text-[#D4AF37]">Support</h4>
              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={callUrl}
                  className="w-full py-2 px-3 rounded-xl bg-secondary border border-white/10 text-foreground text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" /> Call Support
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>© 2026 TalentAI Technologies Inc. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-gray-400">
              <span>Colombo, Sri Lanka</span>
              <span>•</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
