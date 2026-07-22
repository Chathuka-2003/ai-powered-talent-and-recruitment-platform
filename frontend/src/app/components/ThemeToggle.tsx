import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Sun, Moon, Sparkles } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className={`w-9 h-9 p-0 rounded-xl ${className}`} disabled>
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      className={`border-white/10 dark:border-white/10 border-gray-300 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold transition-all ${
        isDark
          ? "bg-secondary/60 hover:bg-secondary text-foreground"
          : "bg-white hover:bg-gray-100 text-[#0A66C2] border-[#0A66C2]/30 shadow-sm"
      } ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to LinkedIn Light Theme" : "Switch to TalentAI Gold Dark Theme"}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">LinkedIn Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-[#0A66C2]" />
          <span className="hidden sm:inline">TalentAI Dark</span>
        </>
      )}
    </Button>
  );
}
