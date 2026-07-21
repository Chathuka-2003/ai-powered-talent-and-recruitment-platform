import { Button } from "../../components/ui/button";
import { GlassCard } from "../../components/GlassCard";
import { useNavigate } from "react-router";
import { Sparkles, BriefcaseBusiness, UserRoundSearch } from "lucide-react";

export function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      icon: UserRoundSearch,
      title: "Job Seeker",
      description: "Find your dream job with AI-powered recommendations",
      color: "text-[#D4AF37]",
      bgColor: "bg-[#D4AF37]/10",
      route: "/jobseeker/login",
    },
    {
      icon: BriefcaseBusiness,
      title: "Employee",
      description: "Sign in with company credentials and TalentAI will open your assigned workspace",
      color: "text-[#D4AF37]",
      bgColor: "bg-[#D4AF37]/10",
      route: "/employee/login",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-[#D4AF37] mr-3" />
            <h1 className="text-4xl font-bold text-foreground">TalentAI</h1>
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">Choose Your Portal</h2>
          <p className="text-muted-foreground text-lg">Job seekers have a dedicated flow; employees are routed by their assigned database role.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <GlassCard
                key={role.title}
                className="p-8 cursor-pointer hover:border-[#D4AF37]/40 transition-all hover:scale-105"
                onClick={() => navigate(role.route)}
              >
                <div className={`rounded-lg ${role.bgColor} p-4 w-fit mb-4`}>
                  <Icon className={`h-8 w-8 ${role.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <Button className="w-full" onClick={(event) => { event.stopPropagation(); navigate(role.route); }}>
                  Continue
                </Button>
              </GlassCard>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
