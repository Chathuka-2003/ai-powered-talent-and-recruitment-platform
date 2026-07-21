import { useState, useEffect, type ReactNode } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Camera, CheckCircle2, Edit3, Plus, Save, Trash2, X, GraduationCap, Briefcase, Award } from "lucide-react";
import { api } from "../../api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";

export function JobSeekerProfile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Database collections
  const [educations, setEducations] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  // Dialog open state
  const [eduOpen, setEduOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);

  // Dialog form state
  const [eduForm, setEduForm] = useState({ institution: "", degree: "", startDate: "", endDate: "" });
  const [expForm, setExpForm] = useState({ company: "", position: "", startDate: "", endDate: "" });
  const [skillForm, setSkillForm] = useState({ name: "", level: "Intermediate" });

  useEffect(() => {
    const userStr = localStorage.getItem("talentai.user");
    if (!userStr) {
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);

    // Use ensure — this finds the existing profile OR creates a blank one.
    // This prevents the 404 "Profile not found" error after a DB rebuild.
    api.candidates.ensure(user.id)
      .then(async (data) => {
        setProfile(data);
        // Load educations, experiences, and skills
        try {
          const [eduList, expList, skillList] = await Promise.all([
            api.candidates.education.getAll(data.id),
            api.candidates.experience.getAll(data.id),
            api.candidates.skills.getAll(data.id)
          ]);
          setEducations(eduList || []);
          setExperience(expList || []);
          setSkills(skillList || []);
        } catch (e) {
          console.error("Error loading child records", e);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Only show the fatal error if the USER record itself doesn't exist (real stale session)
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("talentai.user");
        localStorage.removeItem("talentai.role");
        window.location.href = "/jobseeker/login";
      });
  }, []);

  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const refreshProfile = async () => {
    if (!profile?.id) return;
    try {
      const data = await api.candidates.ensure(JSON.parse(localStorage.getItem("talentai.user") || "{}").id);
      setProfile(data);
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  const handleSave = async () => {
    try {
      await api.candidates.update(profile.id, profile);
      toast.success("Profile updated successfully!");
      setEditing(false);
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    }
  };

  // --- Education CRUD ---
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.institution || !eduForm.degree || !eduForm.startDate || !eduForm.endDate) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await api.candidates.education.add(profile.id, eduForm);
      setEducations((prev) => [response, ...prev]);
      setEduForm({ institution: "", degree: "", startDate: "", endDate: "" });
      setEduOpen(false);
      toast.success("Education record added!");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to add education.");
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    try {
      await api.candidates.education.delete(profile.id, eduId);
      setEducations((prev) => prev.filter((x) => (x.id || x.Id) !== eduId));
      toast.success("Education record deleted.");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to delete education.");
    }
  };

  // --- Experience CRUD ---
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company || !expForm.position || !expForm.startDate || !expForm.endDate) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await api.candidates.experience.add(profile.id, expForm);
      setExperience((prev) => [response, ...prev]);
      setExpForm({ company: "", position: "", startDate: "", endDate: "" });
      setExpOpen(false);
      toast.success("Experience record added!");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to add experience.");
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    try {
      await api.candidates.experience.delete(profile.id, expId);
      setExperience((prev) => prev.filter((x) => (x.id || x.Id) !== expId));
      toast.success("Experience record deleted.");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to delete experience.");
    }
  };

  // --- Skill CRUD ---
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) {
      toast.error("Please enter skill name.");
      return;
    }
    try {
      const response = await api.candidates.skills.add(profile.id, skillForm);
      setSkills((prev) => [...prev, response]);
      setSkillForm({ name: "", level: "Intermediate" });
      setSkillOpen(false);
      toast.success("Skill added!");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (csId: string) => {
    try {
      await api.candidates.skills.delete(profile.id, csId);
      setSkills((prev) => prev.filter((x) => (x.id || x.Id) !== csId));
      toast.success("Skill deleted.");
      await refreshProfile();
    } catch (err: any) {
      toast.error("Failed to delete skill.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="jobseeker">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground animate-pulse">Loading profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout role="jobseeker">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-400">Profile not found. Please log in again.</p>
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${profile.user?.firstName?.[0] || ""}${profile.user?.lastName?.[0] || ""}` || "JS";

  return (
    <DashboardLayout role="jobseeker">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#D4AF37]">Dashboard / My Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your candidate identity, career story, skills, and open-to-work preferences.</p>
          </div>
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}><Edit3 className="mr-2 h-4 w-4" />Edit Profile</Button>
            )}
          </div>
        </div>

        <div className="grid xl:grid-cols-[1.4fr_.8fr] gap-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-5">Personal Information</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-full border border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/30 to-secondary flex items-center justify-center text-3xl font-semibold text-[#D4AF37]">
                  {initials}
                </div>
                <Button variant="outline" size="sm"><Camera className="mr-2 h-4 w-4" />Profile Picture</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">First Name</label>
                  <Input disabled className="mt-2 bg-secondary/50 border-border text-muted-foreground" value={profile.user?.firstName || ""} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Last Name</label>
                  <Input disabled className="mt-2 bg-secondary/50 border-border text-muted-foreground" value={profile.user?.lastName || ""} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email Address</label>
                  <Input disabled className="mt-2 bg-secondary/50 border-border text-muted-foreground" value={profile.user?.email || ""} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Phone Number</label>
                  <Input disabled={!editing} className="mt-2 bg-secondary border-border text-foreground" value={profile.phoneNumber || ""} onChange={(e) => handleChange("phoneNumber", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Location</label>
                  <Input disabled={!editing} className="mt-2 bg-secondary border-border text-foreground" value={profile.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-border bg-card/80">
            <div className="flex items-center gap-2 mb-4">
              <span className={`h-3 w-3 rounded-full ${profile.isOpenToWork ? "bg-green-500" : "bg-gray-500"}`} />
              <h2 className="text-xl font-semibold text-foreground">Open To Work</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-muted-foreground">Looking for a Job</span>
                {editing ? (
                  <select
                    className="bg-secondary border border-border text-foreground rounded px-2 py-1"
                    value={profile.isOpenToWork ? "true" : "false"}
                    onChange={(e) => handleChange("isOpenToWork", e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <span className="text-foreground">{profile.isOpenToWork ? "Yes" : "No"}</span>
                )}
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-muted-foreground">Preferred Role</span>
                {editing ? (
                  <Input className="bg-secondary border-border text-foreground max-w-[150px] h-8" value={profile.preferredJobRole || ""} onChange={(e) => handleChange("preferredJobRole", e.target.value)} />
                ) : (
                  <span className="text-foreground">{profile.preferredJobRole || "Not specified"}</span>
                )}
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-muted-foreground">Employment Type</span>
                {editing ? (
                  <Input className="bg-secondary border-border text-foreground max-w-[150px] h-8" value={profile.employmentType || ""} onChange={(e) => handleChange("employmentType", e.target.value)} />
                ) : (
                  <span className="text-foreground">{profile.employmentType || "Not specified"}</span>
                )}
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-muted-foreground">Preferred Location</span>
                {editing ? (
                  <Input className="bg-secondary border-border text-foreground max-w-[150px] h-8" value={profile.preferredLocation || ""} onChange={(e) => handleChange("preferredLocation", e.target.value)} />
                ) : (
                  <span className="text-foreground">{profile.preferredLocation || "Not specified"}</span>
                )}
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <span className="text-muted-foreground">Work Preference</span>
                {editing ? (
                  <Input className="bg-secondary border-border text-foreground max-w-[150px] h-8" value={profile.workPreference || ""} onChange={(e) => handleChange("workPreference", e.target.value)} />
                ) : (
                  <span className="text-foreground">{profile.workPreference || "Not specified"}</span>
                )}
              </div>
            </div>
            {editing && (
              <div className="mt-5">
                <Button className="w-full" onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
              </div>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Professional Information</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Professional Headline</label>
              <Input disabled={!editing} className="mt-2 bg-secondary border-border text-foreground" value={profile.professionalHeadline || ""} onChange={(e) => handleChange("professionalHeadline", e.target.value)} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Profile Completeness</label>
              <div className="mt-2 rounded-lg bg-secondary p-3 text-[#D4AF37] font-semibold">{profile.profileCompleteness || 45}% complete</div>
            </div>
            <div className="lg:col-span-2">
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">About Me / Summary</label>
              <Textarea disabled={!editing} className="mt-2 bg-secondary border-border text-foreground min-h-28" value={profile.summary || ""} onChange={(e) => handleChange("summary", e.target.value)} />
            </div>
          </div>
        </GlassCard>

        {/* Education Section */}
        <Section title="Education" onAdd={() => setEduOpen(true)} addLabel="Add Education">
          {educations.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-secondary/20">
              <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No education records found. Add your academic qualifications.</p>
            </div>
          ) : (
            educations.map((e) => (
              <div key={e.id || e.Id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/45 p-4">
                <div>
                  <h3 className="text-foreground font-medium">{e.institution}</h3>
                  <p className="text-muted-foreground text-sm">{e.degree}</p>
                  <Badge variant="outline" className="mt-2 border-border text-[#D4AF37]">
                    {new Date(e.startDate).getFullYear()} - {new Date(e.endDate).getFullYear()}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDeleteEducation(e.id || e.Id)}>
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </Button>
              </div>
            ))
          )}
        </Section>

        {/* Experience Section */}
        <Section title="Experience" onAdd={() => setExpOpen(true)} addLabel="Add Experience">
          {experience.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-secondary/20">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No experience history found. Add your professional experience.</p>
            </div>
          ) : (
            experience.map((e) => (
              <div key={e.id || e.Id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/45 p-4">
                <div>
                  <h3 className="text-foreground font-medium">{e.position}</h3>
                  <p className="text-muted-foreground text-sm">{e.company}</p>
                  <Badge variant="outline" className="mt-2 border-border text-[#D4AF37]">
                    {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDeleteExperience(e.id || e.Id)}>
                  <Trash2 className="mr-2 w-4 h-4" />Delete
                </Button>
              </div>
            ))
          )}
        </Section>

        {/* Skills Section */}
        <GlassCard className="p-6">
          <div className="flex justify-between mb-5">
            <h2 className="text-xl font-semibold text-foreground">Skills</h2>
            <Button onClick={() => setSkillOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Skill</Button>
          </div>
          {skills.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-secondary/20">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No skills added yet. Add some to stand out to recruiters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id || skill.Id} className="rounded-xl border border-border bg-secondary/50 p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-foreground">{skill.name}</h4>
                    <Badge variant="secondary" className="mt-1">{skill.level}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDeleteSkill(skill.id || skill.Id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* --- ADD EDUCATION DIALOG --- */}
      <Dialog open={eduOpen} onOpenChange={setEduOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Add Education Record</DialogTitle>
            <DialogDescription className="text-muted-foreground">Enter details of your academic background.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEducation} className="space-y-4">
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Institution Name</label>
              <Input className="bg-secondary border-border text-foreground" value={eduForm.institution} onChange={(e) => setEduForm({...eduForm, institution: e.target.value})} placeholder="e.g. University of Colombo" required />
            </div>
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Degree / Certification</label>
              <Input className="bg-secondary border-border text-foreground" value={eduForm.degree} onChange={(e) => setEduForm({...eduForm, degree: e.target.value})} placeholder="e.g. BSc in Computer Science" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase text-muted-foreground block mb-1">Start Date</label>
                <Input type="date" className="bg-secondary border-border text-foreground" value={eduForm.startDate} onChange={(e) => setEduForm({...eduForm, startDate: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground block mb-1">End Date</label>
                <Input type="date" className="bg-secondary border-border text-foreground" value={eduForm.endDate} onChange={(e) => setEduForm({...eduForm, endDate: e.target.value})} required />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEduOpen(false)}>Cancel</Button>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- ADD EXPERIENCE DIALOG --- */}
      <Dialog open={expOpen} onOpenChange={setExpOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Add Experience Record</DialogTitle>
            <DialogDescription className="text-muted-foreground">Enter details of your professional history.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExperience} className="space-y-4">
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Company Name</label>
              <Input className="bg-secondary border-border text-foreground" value={expForm.company} onChange={(e) => setExpForm({...expForm, company: e.target.value})} placeholder="e.g. Virtusa Corporation" required />
            </div>
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Position / Job Title</label>
              <Input className="bg-secondary border-border text-foreground" value={expForm.position} onChange={(e) => setExpForm({...expForm, position: e.target.value})} placeholder="e.g. Software Engineer Intern" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase text-muted-foreground block mb-1">Start Date</label>
                <Input type="date" className="bg-secondary border-border text-foreground" value={expForm.startDate} onChange={(e) => setExpForm({...expForm, startDate: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground block mb-1">End Date</label>
                <Input type="date" className="bg-secondary border-border text-foreground" value={expForm.endDate} onChange={(e) => setExpForm({...expForm, endDate: e.target.value})} required />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setExpOpen(false)}>Cancel</Button>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- ADD SKILL DIALOG --- */}
      <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription className="text-muted-foreground">Select proficiency level and add skill.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Skill Name</label>
              <Input className="bg-secondary border-border text-foreground" value={skillForm.name} onChange={(e) => setSkillForm({...skillForm, name: e.target.value})} placeholder="e.g. React" required />
            </div>
            <div>
              <label className="text-xs uppercase text-muted-foreground block mb-1">Proficiency Level</label>
              <Select value={skillForm.level} onValueChange={(v) => setSkillForm({...skillForm, level: v})}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setSkillOpen(false)}>Cancel</Button>
              <Button type="submit">Add Skill</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Section({ title, children, onAdd, addLabel }: { title: string; children: ReactNode; onAdd: () => void; addLabel: string }) {
  return <GlassCard className="p-6"><div className="flex justify-between mb-5"><h2 className="text-xl font-semibold text-foreground">{title}</h2><Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" />{addLabel}</Button></div><div className="space-y-3">{children}</div></GlassCard>;
}
