import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Search, Star, MapPin, Briefcase, Eye } from "lucide-react";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { api, BACKEND_URL } from "../../api";

const parseSkills = (skillsJson: string) => {
  if (!skillsJson) return [];
  try {
    const parsed = JSON.parse(skillsJson);
    return Array.isArray(parsed) ? parsed : [skillsJson];
  } catch {
    return [skillsJson];
  }
};

export function CandidateSearch() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await api.candidates.getAll();
        setCandidates(data || []);
      } catch (err) {
        console.error("Error loading candidates", err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  if (selectedCandidate) {
    return (
      <DashboardLayout role="recruiter">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Profile</h1>
            <p className="text-muted-foreground">Detailed view of the candidate's profile</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Back to Search</Button>
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {selectedCandidate.user ? `${selectedCandidate.user.firstName} ${selectedCandidate.user.lastName}` : "Unnamed Candidate"}
              </h2>
              <p className="text-xl text-[#D4AF37] mt-1">{selectedCandidate.professionalHeadline || "Not Specified"}</p>
            </div>
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] text-lg py-1 px-3">
              <Star className="h-4 w-4 mr-2" />
              {selectedCandidate.resumeScore ? `${selectedCandidate.resumeScore}% Match` : 'No Match Data'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Contact & Location</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-3" /> {selectedCandidate.location || "Remote"}</div>
                {selectedCandidate.phoneNumber && <div className="flex items-center"><Briefcase className="h-4 w-4 mr-3" /> {selectedCandidate.phoneNumber}</div>}
                {selectedCandidate.user?.email && <div className="flex items-center"><Eye className="h-4 w-4 mr-3" /> {selectedCandidate.user.email}</div>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Preferences</h3>
              <div className="space-y-3 text-muted-foreground">
                <div><strong>Employment Type:</strong> {selectedCandidate.employmentType || "Open"}</div>
                <div><strong>Work Preference:</strong> {selectedCandidate.workPreference || "Flexible"}</div>
                <div><strong>Open to Work:</strong> {selectedCandidate.isOpenToWork ? "Yes" : "Not Actively Looking"}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{selectedCandidate.summary || "No summary provided."}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {parseSkills(selectedCandidate.suggestedSkills).map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-sm py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          {selectedCandidate.resumeUrl && (
            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <Button onClick={() => window.open(`${BACKEND_URL}${selectedCandidate.resumeUrl}`, "_blank")}>
                View Full Resume
              </Button>
            </div>
          )}
        </GlassCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Find Candidates</h1>
        <p className="text-muted-foreground">Search and discover talented professionals</p>
      </div>

      <GlassCard className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by skills, job title, or keywords..."
            className="pl-10 bg-card border-border text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-muted-foreground text-sm">No candidates found in the database.</p>
        ) : (
          candidates.filter(c => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const title = (c.professionalHeadline || "").toLowerCase();
            const name = c.user ? `${c.user.firstName} ${c.user.lastName}`.toLowerCase() : "";
            const skills = (parseSkills(c.suggestedSkills) || []).map((s: string) => s.toLowerCase()).join(" ");
            return title.includes(q) || name.includes(q) || skills.includes(q);
          }).map((candidate) => (
            <GlassCard key={candidate.id} className="p-6 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {candidate.user ? `${candidate.user.firstName} ${candidate.user.lastName}` : "Unnamed Candidate"}
                    </h3>
                    <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                      <Star className="h-3 w-3 mr-1" />
                      {candidate.resumeScore ? `${candidate.resumeScore}% Match` : 'No Match Data'}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-3">{candidate.professionalHeadline || "Not Specified"}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{candidate.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{candidate.employmentType || candidate.workPreference || "Open to opportunities"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parseSkills(candidate.suggestedSkills).map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={async () => {
                  try {
                    await api.candidates.recordView(candidate.id);
                    toast.success(`You viewed ${candidate.user ? candidate.user.firstName : 'the candidate'}'s profile. The candidate's dashboard has been updated.`);
                  } catch (e) {
                    console.error("View profile error", e);
                  }
                  setSelectedCandidate(candidate);
                }}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
