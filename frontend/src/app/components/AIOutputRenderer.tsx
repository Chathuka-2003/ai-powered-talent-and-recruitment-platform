import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, ChevronRight, Info, AlertCircle, FileText, Star, Briefcase } from "lucide-react";

interface AIOutputRendererProps {
  data: any;
}

export function AIOutputRenderer({ data }: AIOutputRendererProps) {
  let parsed = data;
  if (typeof data === "string") {
    try {
      // Remove markdown code blocks if present
      const cleanStr = data.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      parsed = JSON.parse(cleanStr);
    } catch (e) {
      // If it fails, treat it as text
      parsed = data;
    }
  }

  if (typeof parsed === "string") {
    return (
      <div className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
        {parsed}
      </div>
    );
  }

  if (Array.isArray(parsed)) {
    return (
      <div className="space-y-3">
        {parsed.map((item, idx) => (
          <div key={idx} className="bg-background/50 border border-border p-3 rounded-lg flex items-start gap-3">
            <ChevronRight className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="flex-1">
              {typeof item === "object" ? (
                <div className="space-y-1">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-muted-foreground capitalize">{k}:</span>{" "}
                      <span className="text-foreground">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground text-sm">{String(item)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof parsed === "object" && parsed !== null) {
    const keys = Object.keys(parsed);
    
    const renderValue = (key: string, val: any) => {
      const k = key.toLowerCase();
      
      // Specialized rendering for known keys
      if (k.includes("score") || k.includes("alignment")) {
        return (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-2xl font-bold text-foreground">{val}</span>
          </div>
        );
      }

      if (k === "pros" || k === "rewards" || k === "matchingskills") {
        const arr = Array.isArray(val) ? val : [val];
        return (
          <ul className="space-y-2 mt-2">
            {arr.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{typeof item === 'object' ? Object.values(item).join(' - ') : String(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      if (k === "cons" || k === "risks" || k === "missingskills") {
        const arr = Array.isArray(val) ? val : [val];
        return (
          <ul className="space-y-2 mt-2">
            {arr.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{typeof item === 'object' ? Object.values(item).join(' - ') : String(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      if (k === "formatting" || k === "resources" || k === "reasons") {
        const arr = Array.isArray(val) ? val : [val];
        return (
          <ul className="space-y-2 mt-2">
            {arr.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{typeof item === 'object' ? Object.values(item).join(' - ') : String(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      if (k === "recommendation" || k === "summary") {
        return (
          <div className="mt-1 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md">
            <p className="text-foreground text-sm leading-relaxed">{String(val)}</p>
          </div>
        );
      }

      // Default rendering for arrays inside object
      if (Array.isArray(val)) {
        return (
          <ul className="space-y-1 mt-2 list-disc list-inside text-sm text-muted-foreground">
            {val.map((item, i) => (
              <li key={i} className="text-foreground">
                {typeof item === "object" ? (
                  <div className="space-y-1 mt-1">
                    {Object.entries(item).map(([ik, iv]) => (
                      <div key={ik} className="text-sm">
                        <span className="font-semibold capitalize text-muted-foreground">{ik}:</span> {String(iv)}
                      </div>
                    ))}
                  </div>
                ) : String(item)}
              </li>
            ))}
          </ul>
        );
      }

      // Default string/number
      return <p className="text-foreground mt-1 text-sm">{String(val)}</p>;
    };

    return (
      <div className="space-y-6">
        {keys.map((key) => (
          <div key={key} className="pb-4 border-b border-border last:border-0 last:pb-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </h4>
            {renderValue(key, parsed[key])}
          </div>
        ))}
      </div>
    );
  }

  return <div>{String(parsed)}</div>;
}
