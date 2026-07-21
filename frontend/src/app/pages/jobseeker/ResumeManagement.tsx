import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { AlertCircle, CheckCircle2, Download, FileText, Trash2, Upload, Eye, RefreshCcw, Loader2 } from "lucide-react";
import { api, BACKEND_URL } from "../../api";

export function ResumeManagement() {
  const [candidate, setCandidate] = useState<any>(null);
  const [fileMessage, setFileMessage] = useState("PDF or DOCX, maximum 5MB");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  let suggestedSkills: string[] = [];
  try { if (candidate?.suggestedSkills) suggestedSkills = JSON.parse(candidate.suggestedSkills); } catch {}
  if (suggestedSkills.length === 0) suggestedSkills = ["Upload resume for suggestions"];

  let improvementSuggestions: string[] = [];
  try { if (candidate?.improvementSuggestions) improvementSuggestions = JSON.parse(candidate.improvementSuggestions); } catch {}
  if (improvementSuggestions.length === 0) improvementSuggestions = ["Upload your resume to get AI feedback on how to improve it!"];

  useEffect(() => {
    loadCandidate();
  }, []);

  const loadCandidate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("talentai.user") || "{}");
      if (user.id) {
        const data = await api.candidates.ensure(user.id);
        setCandidate(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file?: File) => {
    if (!file) return;
    const valid = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) || /\.(pdf|docx)$/i.test(file.name);
    if (!valid) return setFileMessage("Invalid format. Upload PDF or DOCX only.");
    if (file.size > 5 * 1024 * 1024) return setFileMessage("File exceeds 5MB maximum size.");
    
    setFileMessage(`${file.name} uploading...`);
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    if (!candidate) return;
    setUploading(true);
    try {
      await api.candidates.uploadResume(candidate.id, file);
      setFileMessage("Resume uploaded successfully!");
      await loadCandidate();
    } catch (err: any) {
      setFileMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidate) return;
    setDeleting(true);
    try {
      await api.candidates.deleteResume(candidate.id);
      await loadCandidate();
    } catch (err: any) {
      console.error("Failed to delete resume:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <DashboardLayout role="jobseeker"><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="jobseeker">
      <div className="space-y-6">
        <div><p className="text-sm text-[#D4AF37]">Dashboard / Resume Manager</p><h1 className="mt-2 text-3xl font-semibold text-foreground">Resume Manager</h1><p className="text-muted-foreground">Upload, update, analyze, and manage the active resume used in applications.</p></div>
        <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Upload Resume</h2>
            <label className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-[#D4AF37]/5"} border-[#D4AF37]/35 bg-secondary/35 p-8 text-center transition-colors`}>
              {uploading ? <Loader2 className="h-10 w-10 text-[#D4AF37] mb-3 animate-spin" /> : <Upload className="h-10 w-10 text-[#D4AF37] mb-3" />}
              <span className="text-foreground font-medium">{uploading ? "Uploading..." : "Drop your resume here or browse"}</span>
              <span className="text-sm text-muted-foreground mt-2">Supported formats: PDF, DOCX</span>
              <input type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => { handleFileSelect(e.target.files?.[0]); e.target.value = ''; }} disabled={uploading} />
            </label>
            <div className="mt-4 flex items-center gap-2 text-sm"><AlertCircle className="h-4 w-4 text-[#D4AF37]" /><span className="text-muted-foreground">{fileMessage}</span></div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-semibold text-foreground">Current Resume</h2><p className="text-muted-foreground text-sm">Primary resume for job applications and AI analysis.</p></div>
              <Badge className={candidate?.resumeFileName ? "bg-green-500/15 text-green-500 border-green-500/30" : "bg-red-500/15 text-red-500 border-red-500/30"}>
                {candidate?.resumeFileName ? "Active" : "None"}
              </Badge>
            </div>
            
            {candidate?.resumeFileName ? (
              <>
                <div className="mt-6 rounded-2xl border border-border bg-secondary/45 p-5 flex gap-4">
                  <div className="rounded-xl bg-[#D4AF37]/10 p-4 h-fit"><FileText className="h-8 w-8 text-[#D4AF37]" /></div>
                  <div className="flex-1 grid sm:grid-cols-2 gap-4 text-sm">
                    <Info label="Resume Name" value={candidate.resumeFileName} />
                    <Info label="Uploaded Date" value={new Date(candidate.resumeUploadedAt).toLocaleDateString()} />
                    <Info label="File Type" value={candidate.resumeFileName.endsWith(".pdf") ? "PDF Document" : "Word Document"} />
                    <Info label="Resume Status" value="Active" />
                  </div>
                </div>
                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button variant="outline" onClick={() => window.open(`${BACKEND_URL}${candidate.resumeUrl}`, "_blank")}>
                    <Eye className="mr-2 h-4 w-4" />View
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`${BACKEND_URL}${candidate.resumeUrl}`, "_blank")}>
                    <Download className="mr-2 h-4 w-4" />Download
                  </Button>
                  <label className={`flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background h-10 px-4 py-2 ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-accent hover:text-accent-foreground cursor-pointer"}`}>
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                    {uploading ? "Replacing..." : "Replace"}
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => { handleFileSelect(e.target.files?.[0]); e.target.value = ''; }} disabled={uploading} />
                  </label>
                  <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-3 opacity-20" />
                <p>No resume uploaded yet.</p>
                <p className="text-sm">Upload a resume to apply for jobs and get AI feedback.</p>
              </div>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">AI Resume Analysis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Score title="Resume Score" value={candidate?.resumeScore || 0} />
            <Score title="Profile Completeness" value={candidate?.profileCompleteness || 0} />
            <div className="rounded-2xl border border-border bg-secondary/45 p-5">
              <h3 className="text-foreground font-medium mb-3">Suggested Skills</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map(skill => (
                  <Badge key={skill} className="bg-[#D4AF37]/15 text-[#D4AF37]">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 grid lg:grid-cols-2 gap-4">
            {improvementSuggestions.map((x) => (
              <div key={x} className="flex gap-3 rounded-xl bg-secondary/45 border border-border p-4">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <span className="text-gray-300 text-sm">{x}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">{label}</p><p className="text-foreground mt-1">{value}</p></div>; }
function Score({ title, value }: { title: string; value: number }) { return <div className="rounded-2xl border border-border bg-secondary/45 p-5"><div className="flex justify-between mb-3"><h3 className="text-foreground font-medium">{title}</h3><span className="text-[#D4AF37] font-semibold">{value}%</span></div><Progress value={value} /></div>; }
