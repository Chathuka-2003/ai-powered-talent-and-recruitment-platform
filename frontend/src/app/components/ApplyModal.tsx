import { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { api } from "../api";

interface ApplyModalProps {
  job: any;
  candidateId: string;
  existingResume?: { fileName: string; url: string } | null;
  onClose: () => void;
  onApplied: (resumeUploaded: boolean) => void;
}

export function ApplyModal({ job, candidateId, existingResume, onClose, onApplied }: ApplyModalProps) {
  const [step, setStep] = useState<"resume" | "applying" | "done">("resume");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useExisting, setUseExisting] = useState(!!existingResume);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedResume, setUploadedResume] = useState(existingResume);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Only PDF and DOCX files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setUseExisting(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const synth = { target: { files: [file] } } as any;
      handleFileSelect(synth);
    }
  };

  const handleApply = async () => {
    setError(null);
    setStep("applying");

    try {
      // Step 1: Upload new CV if selected
      if (selectedFile && !useExisting) {
        setUploadProgress(true);
        await api.candidates.uploadResume(candidateId, selectedFile);
        setUploadProgress(false);
        setUploadedResume({ fileName: selectedFile.name, url: "" });
      }

      // Step 2: Submit application
      await api.applications.apply(candidateId, job.id);

      setStep("done");
      setTimeout(() => onApplied(!!selectedFile), 1500);
    } catch (err: any) {
      setStep("resume");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const canApply = useExisting || !!selectedFile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0F0F0F] border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Apply for Position</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "done" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground text-sm">
                Your application for <span className="text-foreground font-medium">{job.title}</span> has been sent successfully.
              </p>
            </div>
          ) : step === "applying" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Loader2 className="h-10 w-10 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-foreground font-medium">
                {uploadProgress ? "Uploading your CV..." : "Submitting application..."}
              </p>
            </div>
          ) : (
            <>
              {/* Job summary */}
              <div className="rounded-xl bg-secondary/50 border border-border p-4 mb-5">
                <p className="text-foreground font-semibold">{job.title}</p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {job.organization?.name || "Organization"} · {job.location || "Remote"}
                </p>
              </div>

              {/* CV Section */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#D4AF37]" />
                  Your CV / Resume
                </p>

                {/* Existing resume option */}
                {existingResume && (
                  <button
                    onClick={() => { setUseExisting(true); setSelectedFile(null); }}
                    className={`w-full flex items-center gap-3 rounded-xl border p-4 mb-3 text-left transition-all ${
                      useExisting
                        ? "border-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-border bg-secondary/30 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      useExisting ? "border-[#D4AF37] bg-[#D4AF37]" : "border-muted-foreground"
                    }`}>
                      {useExisting && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Use existing CV</p>
                      <p className="text-xs text-muted-foreground truncate">{existingResume.fileName}</p>
                    </div>
                    {useExisting && <CheckCircle2 className="h-4 w-4 text-[#D4AF37] ml-auto shrink-0" />}
                  </button>
                )}

                {/* Upload new CV */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all text-center ${
                    selectedFile && !useExisting
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-border hover:border-[#D4AF37]/50 hover:bg-secondary/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {selectedFile && !useExisting ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="h-6 w-6 text-[#D4AF37]" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-foreground font-medium">
                        {existingResume ? "Upload a different CV" : "Upload your CV"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drag & drop or click · PDF, DOCX · Max 5MB
                      </p>
                    </>
                  )}
                </div>

                {/* AI Notice */}
                {selectedFile && !useExisting && (
                  <div className="flex items-start gap-2 mt-3 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3">
                    <Sparkles className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-400">
                      Your CV will be analysed by AI to extract your skills and match you against future jobs.
                    </p>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {!canApply && (
                <p className="text-xs text-muted-foreground text-center mb-4">
                  Please upload a CV or use your existing one to apply.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step === "resume" && (
          <div className="px-6 pb-6 flex items-center gap-3">
            <Button
              onClick={handleApply}
              disabled={!canApply}
              className="flex-1 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
            >
              Submit Application
            </Button>
            <Button variant="outline" onClick={onClose} className="border-border text-muted-foreground">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
