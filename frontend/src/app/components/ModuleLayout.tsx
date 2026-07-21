import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Sparkles, ChevronLeft, LucideIcon } from "lucide-react";

interface ModuleTab {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface ModuleLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  tabs: ModuleTab[];
  backPath?: string;
  backLabel?: string;
}

export function ModuleLayout({
  children,
  title,
  subtitle,
  icon: Icon,
  tabs,
  backPath = "/",
  backLabel = "Back",
}: ModuleLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-1"
                onClick={() => navigate(backPath)}
              >
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Button>
              <div className="h-4 w-px bg-[#D4AF37]/20" />
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-lg font-bold text-foreground">TalentAI</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-foreground font-semibold hidden md:block">{title}</span>
            </div>
          </div>
        </div>

        {/* Module tab navigation */}
        <div className="border-t border-border px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const active = location.pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-muted-foreground hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page header */}
      <div className="border-b border-border bg-card/30 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-border">
            <Icon className="h-7 w-7 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
