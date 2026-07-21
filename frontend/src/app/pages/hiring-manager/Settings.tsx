import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import {
  Bell,
  FileText,
  GitBranch,
  Calendar,
  BarChart2,
  Save,
  ChevronRight,
  Clock,
  Mail,
  Users,
  CheckSquare,
} from "lucide-react";

type SettingsTab = "Notifications" | "Evaluation" | "Workflow" | "Calendar" | "Reporting";

const tabs: { label: SettingsTab; icon: React.ReactNode }[] = [
  { label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { label: "Evaluation", icon: <FileText className="w-4 h-4" /> },
  { label: "Workflow", icon: <GitBranch className="w-4 h-4" /> },
  { label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
  { label: "Reporting", icon: <BarChart2 className="w-4 h-4" /> },
];

export function ManagerSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Notifications");

  // Notifications
  const [notifToggles, setNotifToggles] = useState({
    pendingReviewEmail: true,
    dailyReviewSummary: true,
    offerApprovalRequest: true,
    interviewFeedbackReminder: true,
    candidateDeclinedOffer: true,
    weeklyHiringReport: false,
  });
  const [reminderTiming, setReminderTiming] = useState<"24h" | "48h" | "72h">("48h");

  // Evaluation Templates
  const [techSkillsWeight, setTechSkillsWeight] = useState([35]);
  const [communicationWeight, setCommunicationWeight] = useState([25]);
  const [problemSolvingWeight, setProblemSolvingWeight] = useState([25]);
  const [cultureFitWeight, setCultureFitWeight] = useState([15]);
  const [scoringScale, setScoringScale] = useState<"1-5" | "1-10" | "Percentage">("1-10");
  const [requireComments, setRequireComments] = useState(true);
  const [blindReview, setBlindReview] = useState(false);

  // Workflow
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [approvalChain, setApprovalChain] = useState<"Single" | "Sequential" | "Parallel">("Sequential");
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [consensusThreshold, setConsensusThreshold] = useState([75]);
  const [minPanelSize, setMinPanelSize] = useState("3");
  const [offerApprovalRequired, setOfferApprovalRequired] = useState(true);

  // Calendar
  const [calendarSync, setCalendarSync] = useState(true);
  const [calendarProvider, setCalendarProvider] = useState<"Google" | "Outlook" | "Apple">("Google");
  const [blockCalendar, setBlockCalendar] = useState(true);
  const [reminderBefore, setReminderBefore] = useState<"15min" | "30min" | "1h">("30min");

  // Reporting
  const [reportToggles, setReportToggles] = useState({
    weeklyPipelineReport: true,
    monthlyHiringMetrics: true,
    diversityReport: false,
    timeToHireTracking: true,
    offerAcceptanceRate: true,
  });
  const [reportFormat, setReportFormat] = useState<"PDF" | "CSV" | "Dashboard Only">("Dashboard Only");

  const toggleNotif = (key: keyof typeof notifToggles) =>
    setNotifToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleReport = (key: keyof typeof reportToggles) =>
    setReportToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const SwitchRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        {description && <p className="text-muted-foreground text-xs mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <DashboardLayout role="hiring-manager">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your hiring manager preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.label
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.label && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Notifications */}
            {activeTab === "Notifications" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    Pending Review Reminder Timing
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    When to remind you about pending candidate evaluations
                  </p>
                  <div className="flex gap-3">
                    {(["24h", "48h", "72h"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setReminderTiming(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          reminderTiming === t
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "border-border text-muted-foreground hover:border-border"
                        }`}
                      >
                        {t} before deadline
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                    Notification Preferences
                  </h2>
                  <SwitchRow label="Pending Review Alerts" description="Notify when candidates are awaiting my evaluation" checked={notifToggles.pendingReviewEmail} onChange={() => toggleNotif("pendingReviewEmail")} />
                  <SwitchRow label="Daily Review Summary" description="Morning email summarizing pending actions" checked={notifToggles.dailyReviewSummary} onChange={() => toggleNotif("dailyReviewSummary")} />
                  <SwitchRow label="Offer Approval Requests" description="Notify when an offer requires my approval" checked={notifToggles.offerApprovalRequest} onChange={() => toggleNotif("offerApprovalRequest")} />
                  <SwitchRow label="Interview Feedback Reminders" description="Remind me to submit feedback after interviews" checked={notifToggles.interviewFeedbackReminder} onChange={() => toggleNotif("interviewFeedbackReminder")} />
                  <SwitchRow label="Candidate Declined Offer" description="Alert when a candidate declines an offer" checked={notifToggles.candidateDeclinedOffer} onChange={() => toggleNotif("candidateDeclinedOffer")} />
                  <SwitchRow label="Weekly Hiring Report" description="Summary of all hiring activity each week" checked={notifToggles.weeklyHiringReport} onChange={() => toggleNotif("weeklyHiringReport")} />
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Notifications
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}

            {/* Evaluation Templates */}
            {activeTab === "Evaluation" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#D4AF37]" />
                    Scoring Configuration
                  </h2>
                  <div className="mb-4">
                    <label className="text-muted-foreground text-xs mb-2 block">Scoring Scale</label>
                    <div className="flex gap-3">
                      {(["1-5", "1-10", "Percentage"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setScoringScale(s)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            scoringScale === s
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                              : "border-border text-muted-foreground hover:border-border"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SwitchRow label="Require Written Comments" description="Evaluators must provide written justification for scores" checked={requireComments} onChange={() => setRequireComments(!requireComments)} />
                  <SwitchRow label="Blind Review Mode" description="Hide candidate names and photos during evaluation" checked={blindReview} onChange={() => setBlindReview(!blindReview)} />
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#D4AF37]" />
                    Evaluation Scoring Weights
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">Customize how each dimension contributes to the overall score</p>
                  {[
                    { label: "Technical Skills", value: techSkillsWeight, set: setTechSkillsWeight },
                    { label: "Communication", value: communicationWeight, set: setCommunicationWeight },
                    { label: "Problem Solving", value: problemSolvingWeight, set: setProblemSolvingWeight },
                    { label: "Culture Fit", value: cultureFitWeight, set: setCultureFitWeight },
                  ].map(({ label, value, set }) => (
                    <div key={label} className="mb-5">
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300 text-sm">{label}</label>
                        <span className="text-[#D4AF37] font-semibold text-sm">{value[0]}%</span>
                      </div>
                      <Slider value={value} onValueChange={set} min={5} max={60} step={5} className="w-full" />
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Template
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}

            {/* Decision Workflow */}
            {activeTab === "Workflow" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#D4AF37]" />
                    Approval Workflow
                  </h2>
                  <SwitchRow label="Require Approval to Advance" description="Candidate advancement requires explicit approval" checked={approvalRequired} onChange={() => setApprovalRequired(!approvalRequired)} />
                  <SwitchRow label="Require Offer Approval" description="Job offers must be approved before sending" checked={offerApprovalRequired} onChange={() => setOfferApprovalRequired(!offerApprovalRequired)} />
                  <SwitchRow label="Auto-Advance on Consensus" description="Automatically advance when consensus threshold is met" checked={autoAdvance} onChange={() => setAutoAdvance(!autoAdvance)} />
                  {autoAdvance && (
                    <div className="py-3">
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300 text-sm">Consensus Threshold</label>
                        <span className="text-[#D4AF37] font-semibold text-sm">{consensusThreshold[0]}%</span>
                      </div>
                      <Slider value={consensusThreshold} onValueChange={setConsensusThreshold} min={50} max={100} step={5} className="w-full" />
                    </div>
                  )}
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    Panel Configuration
                  </h2>
                  <div className="mb-4">
                    <label className="text-muted-foreground text-xs mb-2 block">Approval Chain Type</label>
                    <div className="flex gap-3">
                      {(["Single", "Sequential", "Parallel"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setApprovalChain(type)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            approvalChain === type
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                              : "border-border text-muted-foreground hover:border-border"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">
                      {approvalChain === "Single" && "One approver required to advance a candidate."}
                      {approvalChain === "Sequential" && "Approvers are notified one at a time in order."}
                      {approvalChain === "Parallel" && "All approvers are notified simultaneously."}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs mb-1 block">Minimum Panel Size</label>
                    <Input
                      value={minPanelSize}
                      onChange={(e) => setMinPanelSize(e.target.value)}
                      className="bg-secondary border-border text-foreground w-24"
                      placeholder="3"
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Workflow
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}

            {/* Calendar Integration */}
            {activeTab === "Calendar" && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  Calendar Integration
                </h2>
                <p className="text-muted-foreground text-sm mb-4">Sync your calendar for interview scheduling</p>
                <div className="mb-4">
                  <label className="text-muted-foreground text-xs mb-2 block">Calendar Provider</label>
                  <div className="flex gap-3">
                    {(["Google", "Outlook", "Apple"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCalendarProvider(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          calendarProvider === p
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "border-border text-muted-foreground hover:border-border"
                        }`}
                      >
                        {p} {p === "Google" ? "Calendar" : p === "Outlook" ? "Calendar" : "Calendar"}
                      </button>
                    ))}
                  </div>
                </div>
                <SwitchRow label="Enable Calendar Sync" description="Automatically sync interview events to your calendar" checked={calendarSync} onChange={() => setCalendarSync(!calendarSync)} />
                <SwitchRow label="Block Availability During Interviews" description="Mark interview slots as busy in your calendar" checked={blockCalendar} onChange={() => setBlockCalendar(!blockCalendar)} />
                <div className="py-3 border-b border-border">
                  <p className="text-foreground text-sm font-medium mb-2">Interview Reminder Time</p>
                  <div className="flex gap-3 mt-1">
                    {(["15min", "30min", "1h"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setReminderBefore(t)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          reminderBefore === t
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "border-border text-muted-foreground hover:border-border"
                        }`}
                      >
                        {t} before
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Calendar Settings
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Reporting Preferences */}
            {activeTab === "Reporting" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#D4AF37]" />
                    Report Delivery Format
                  </h2>
                  <div className="flex gap-3">
                    {(["PDF", "CSV", "Dashboard Only"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setReportFormat(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          reportFormat === f
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "border-border text-muted-foreground hover:border-border"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                    Report Subscriptions
                  </h2>
                  <SwitchRow label="Weekly Pipeline Report" description="Overview of all active hiring pipelines" checked={reportToggles.weeklyPipelineReport} onChange={() => toggleReport("weeklyPipelineReport")} />
                  <SwitchRow label="Monthly Hiring Metrics" description="Comprehensive monthly hiring analytics" checked={reportToggles.monthlyHiringMetrics} onChange={() => toggleReport("monthlyHiringMetrics")} />
                  <SwitchRow label="Diversity & Inclusion Report" description="Demographic breakdown of hiring pipeline" checked={reportToggles.diversityReport} onChange={() => toggleReport("diversityReport")} />
                  <SwitchRow label="Time-to-Hire Tracking" description="Track how long each stage takes per role" checked={reportToggles.timeToHireTracking} onChange={() => toggleReport("timeToHireTracking")} />
                  <SwitchRow label="Offer Acceptance Rate" description="Monitor offer acceptance trends over time" checked={reportToggles.offerAcceptanceRate} onChange={() => toggleReport("offerAcceptanceRate")} />
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Reporting Preferences
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
