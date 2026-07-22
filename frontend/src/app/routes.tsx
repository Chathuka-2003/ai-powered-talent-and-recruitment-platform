import { createBrowserRouter, Navigate, useLocation } from "react-router";
import type { ComponentType } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { JobSeekerDashboard } from "./pages/jobseeker/Dashboard";
import { JobSeekerProfile } from "./pages/jobseeker/Profile";
import { ResumeManagement } from "./pages/jobseeker/ResumeManagement";
import { JobSearch } from "./pages/jobseeker/JobSearch";
import { ApplicationTracking } from "./pages/jobseeker/ApplicationTracking";
import { AIRecommendations } from "./pages/jobseeker/AIRecommendations";
import { JobSeekerMessages } from "./pages/jobseeker/Messages";
import { SeekerNotifications } from "./pages/jobseeker/Notifications";
import { SeekerSettings } from "./pages/jobseeker/Settings";
import { JobSeekerInterviews } from "./pages/jobseeker/Interviews";
import { JobseekerAISuiteView } from "./pages/jobseeker/JobseekerAISuiteView";
import { JobSeekerCalendar } from "./pages/jobseeker/Calendar";
import { RecruiterDashboard } from "./pages/recruiter/Dashboard";
import { JobManagement as RecruiterJobManagement } from "./pages/recruiter/JobManagement";
import { CandidateSearch } from "./pages/recruiter/CandidateSearch";
import { ResumeReader } from "./pages/recruiter/ResumeReader";
import { RecruiterSettings } from "./pages/recruiter/Settings";
import { RecruiterMessages } from "./pages/recruiter/Messages";
import { RecruiterNotifications } from "./pages/recruiter/Notifications";
import { RecruiterInterviews } from "./pages/recruiter/Interviews";
import { InterviewScheduling } from "./pages/recruiter/InterviewScheduling";
import { RecruiterJobRequisitions } from "./pages/recruiter/JobRequisitions";
import { RecruiterAISuiteView } from "./pages/recruiter/RecruiterAISuiteView";
import { HMDashboard, HMProfile, JobRequisitions, AssignedJobs, Candidates, CandidateDetails, Reviews, Evaluations, Interviews, Feedback, HMCalendar, Decisions, Reports, Team, HMMessages, HMNotifications, HMSuite, HMSettings } from "./pages/hiring-manager/HiringManagerExperience";
import { VideoInterview } from "./pages/shared/VideoInterview";
import { NotFound } from "./pages/NotFound";
import { AdminDashboard, UserManagement, UserProfile, UserForm, RoleManagement, PermissionsPage, OrganizationManagement, OrganizationProfile, OrganizationCreateForm, JobCreateForm, JobManagement, JobDetails, ApplicationManagement, ApplicationDetails, InterviewManagement, InterviewDetails, AIMonitoring, AnalyticsPage, AuditLogs, Notifications, AdminSettings, AdminProfile, Detail, FormPage, AILogsTable, InfrastructurePage } from "./pages/admin/AdminExperience";
import { AccessDenied } from "./pages/AccessDenied";
import { DynamicRolePage } from "./pages/DynamicRolePage";
import { getCurrentRole, getDefaultLoginPathForPath, type UserRole } from "./auth";

function Guard({ roles, Component }: { roles: UserRole[]; Component: ComponentType }) {
  const location = useLocation();
  const role = getCurrentRole();
  if (!role) return <Navigate to={getDefaultLoginPathForPath(location.pathname)} replace />;
  if (roles.includes(role)) return <Component />;
  return <Navigate to="/access-denied" replace />;
}


function InboxRouter() {
  return getCurrentRole() === "jobseeker" ? <JobSeekerMessages /> : getCurrentRole() === "recruiter" ? <RecruiterMessages /> : <DynamicRolePage role={getCurrentRole() || "hiring-manager"} title="Inbox" subtitle="Unified communication inbox for approved platform conversations." />;
}

function NotificationsRouter() {
  return getCurrentRole() === "jobseeker" ? <SeekerNotifications /> : getCurrentRole() === "recruiter" ? <RecruiterNotifications /> : <DynamicRolePage role={getCurrentRole() || "hiring-manager"} title="Notifications" subtitle="View application, interview, message, AI recommendation, and system alerts." />;
}

function page(role: UserRole, title: string, subtitle: string, primaryTo: string, secondaryTo = "/messages/inbox") {
  return function GeneratedPage() {
    return <DynamicRolePage role={role} title={title} subtitle={subtitle} primaryAction={{ label: "Create / Update", to: primaryTo }} secondaryAction={{ label: "Open related", to: secondaryTo }} />;
  };
}

const JS = {
  Profile: page("jobseeker", "Profile Management", "Manage personal information, portfolio links, experience, education, and visibility preferences.", "/jobseeker/profile", "/jobseeker/resume"),
  Resume: page("jobseeker", "Resume Manager", "Upload resumes, maintain the resume library, and run AI parsing and skill extraction.", "/ai/resume-parsing", "/jobseeker/resume-library"),
  ResumeLibrary: page("jobseeker", "Resume Library", "Compare resume versions and choose the active resume for applications.", "/jobseeker/resume", "/ai/skill-extraction"),
  Jobs: page("jobseeker", "Job Search", "Discover roles by title, location, salary, company, and AI fit score.", "/jobseeker/job-details", "/jobseeker/saved-jobs"),
  JobDetails: page("jobseeker", "Job Details", "Review company context, requirements, salary range, AI match reasons, and application steps.", "/jobseeker/apply", "/jobseeker/jobs"),
  Apply: page("jobseeker", "Job Application", "Submit tailored resumes, cover notes, screening answers, and availability.", "/jobseeker/applications", "/jobseeker/resume"),
  Applications: page("jobseeker", "Application Tracking", "Track submitted, reviewed, shortlisted, interview, offer, and declined statuses.", "/jobseeker/applications", "/jobseeker/interviews"),
  Saved: page("jobseeker", "Saved Jobs", "Maintain a shortlist of roles to compare and apply to later.", "/jobseeker/apply", "/jobseeker/jobs"),
  AI: page("jobseeker", "AI Recommendations", "Personalized jobs, skill gaps, resume insights, and next-best actions.", "/ai/recommendations", "/ai/candidate-matching"),
  Interviews: page("jobseeker", "Interview Invitations", "Accept invitations, join video interviews, and sync calendar events.", "/interviews/calendar", "/interviews/video-room"),
  Settings: page("jobseeker", "Candidate Settings", "Notification, privacy, account security, and job alert preferences.", "/jobseeker/settings", "/messages/notifications"),
};

const R = {
  Company: page("recruiter", "Company Profile", "Create and manage the employer profile, organization hierarchy, and public brand presence.", "/recruiter/company-settings", "/recruiter/hiring-managers"),
  Jobs: page("recruiter", "Job Postings", "Create, edit, publish, pause, and archive company job postings.", "/recruiter/jobs/create", "/recruiter/applications"),
  CreateJob: page("recruiter", "Create Job", "Define role details, requirements, compensation, hiring team, and evaluation criteria.", "/recruiter/jobs", "/recruiter/hiring-managers"),
  EditJob: page("recruiter", "Edit Job", "Update posting content, pipeline stages, assigned hiring managers, and screening questions.", "/recruiter/jobs", "/recruiter/applications"),
  Candidates: page("recruiter", "Candidate Search", "Search candidates, filter by skills, experience, availability, and AI fit score.", "/recruiter/candidate-details", "/recruiter/talent-pool"),
  CandidateDetails: page("recruiter", "Candidate Details", "View profiles, resumes, AI summaries, applications, notes, and communication history.", "/recruiter/shortlisting", "/recruiter/interviews/schedule"),
  Applications: page("recruiter", "Application Review", "View all company applications and progress candidates through the hiring funnel.", "/recruiter/shortlisting", "/recruiter/candidate-details"),
  Shortlisting: page("recruiter", "Shortlisting", "Create candidate shortlists and assign them to hiring managers for review.", "/recruiter/hiring-managers", "/hiring-manager/reviews"),
  AIRanking: page("recruiter", "AI Candidate Ranking", "Rank applicants and talent pool candidates against job requirements.", "/ai/candidate-ranking", "/recruiter/candidate-details"),
  Interviews: page("recruiter", "Interview Scheduling", "Schedule interview panels, video rooms, feedback forms, and calendar integrations.", "/interviews/schedule", "/interviews/calendar"),
  TalentPool: page("recruiter", "Talent Pool", "Manage sourced candidates, tags, nurture campaigns, and future-fit lists.", "/recruiter/candidates", "/messages/email-center"),
  HiringManagers: page("recruiter", "Invite Hiring Managers", "Create hiring manager accounts, assign jobs, and manage review responsibilities.", "/recruiter/hiring-managers", "/recruiter/jobs"),
  Analytics: page("recruiter", "Recruitment Analytics", "Analyze active jobs, funnel conversion, source quality, time-to-hire, and AI match scores.", "/ai/hiring-analytics", "/ai/hiring-trends"),
  Settings: page("recruiter", "Company Settings", "Manage company profile, hiring workflow settings, subscriptions, and recruiter permissions.", "/recruiter/company-profile", "/admin/organizations"),
};

const HM = {
  AssignedJobs: page("hiring-manager", "Assigned Jobs", "View only jobs assigned by recruiters within your organization.", "/hiring-manager/reviews", "/hiring-manager/calendar"),
  Reviews: page("hiring-manager", "Candidate Reviews", "Review shortlisted candidates, resumes, recruiter notes, and AI summaries.", "/hiring-manager/evaluations", "/hiring-manager/scorecard"),
  Evaluation: page("hiring-manager", "Candidate Evaluation", "Record structured feedback for assigned candidates and jobs.", "/hiring-manager/scorecard", "/hiring-manager/decisions"),
  Scorecard: page("hiring-manager", "Candidate Scorecard", "Compare technical, cultural, leadership, and role-specific score dimensions.", "/hiring-manager/feedback", "/hiring-manager/decisions"),
  Feedback: page("hiring-manager", "Interview Feedback", "Submit post-interview observations and recommended next steps.", "/hiring-manager/decisions", "/interviews/timeline"),
  Decisions: page("hiring-manager", "Hiring Decisions", "Make hire/no-hire recommendations for assigned candidates only.", "/hiring-manager/calendar", "/messages/direct-chat"),
  Calendar: page("hiring-manager", "Calendar Integration", "View assigned interviews and connect Google Calendar or Outlook Calendar.", "/interviews/calendar", "/interviews/schedule"),
};

const A = {
  Users: page("admin", "User Management", "Manage Job Seekers, Recruiters, Hiring Managers, and Administrators across the platform.", "/admin/users", "/admin/roles"),
  Roles: page("admin", "Role Management", "Define RBAC policies, route permissions, and administrative privileges.", "/admin/roles", "/admin/audit-logs"),
  Organizations: page("admin", "Organization Management", "Inspect organizations, recruiters, hiring managers, jobs, and candidates.", "/admin/organizations", "/admin/users"),
  Audit: page("admin", "Audit Logs", "Review security events, access checks, data changes, and AI usage decisions.", "/admin/audit-logs", "/admin/monitoring"),
  Analytics: page("admin", "Analytics Dashboard", "Monitor total users, recruiters, candidates, active jobs, AI usage, and platform growth.", "/admin/analytics", "/ai/hiring-analytics"),
  Monitoring: page("admin", "System Monitoring", "Track system health, queues, integrations, video rooms, and calendar connectors.", "/admin/monitoring", "/admin/ai-monitoring"),
  AIMonitoring: page("admin", "AI Monitoring", "Monitor model usage, ranking explanations, parsing confidence, and bias review queues.", "/ai/hiring-analytics", "/admin/audit-logs"),
  Settings: page("admin", "Administrator Settings", "Configure platform security, feature flags, integrations, and enterprise defaults.", "/admin/settings", "/admin/roles"),
};

const AI = {
  ResumeParsing: page("recruiter", "AI Resume Parsing", "Extract structured experience, education, projects, and certifications from resumes.", "/ai/skill-extraction", "/recruiter/candidates"),
  SkillExtraction: page("recruiter", "Skill Extraction", "Normalize skills, infer proficiency, and identify adjacent capabilities.", "/ai/candidate-ranking", "/ai/candidate-matching"),
  CandidateRanking: page("recruiter", "Candidate Ranking", "Score candidates against job requirements with transparent match rationale.", "/recruiter/shortlisting", "/ai/candidate-matching"),
  CandidateMatching: page("recruiter", "Candidate Matching", "Match candidates to jobs and jobs to candidates across the organization.", "/ai/recommendations", "/recruiter/talent-pool"),
  HiringAnalytics: page("recruiter", "Hiring Analytics", "Analyze funnel performance, source quality, diversity indicators, and time-to-hire.", "/ai/hiring-trends", "/recruiter/analytics"),
  HiringTrends: page("recruiter", "Hiring Trends", "Forecast hiring demand, bottlenecks, and market compensation movement.", "/ai/hiring-analytics", "/admin/analytics"),
  Recommendations: page("jobseeker", "AI Recommendations", "Deliver candidate job recommendations, resume improvements, and skill growth paths.", "/jobseeker/jobs", "/jobseeker/resume"),
};

const M = {
  Inbox: page("jobseeker", "Inbox", "Unified communication inbox for candidate, recruiter, hiring manager, and admin messages.", "/messages/direct-chat", "/messages/email-center"),
  DirectChat: page("jobseeker", "Direct Chat", "Real-time role-safe conversations with candidates, recruiters, and assigned hiring managers.", "/messages/inbox", "/interviews/schedule"),
  Email: page("recruiter", "Email Center", "Compose interview invites, application updates, nurture campaigns, and system emails.", "/messages/inbox", "/messages/notifications"),
  Notifications: page("jobseeker", "Notifications", "View application, interview, message, AI recommendation, and system alerts.", "/messages/inbox", "/jobseeker/settings"),
};

const I = {
  Schedule: page("recruiter", "Interview Schedule", "Coordinate panels, rooms, candidate availability, Google Calendar, and Outlook Calendar.", "/interviews/calendar", "/interviews/video-room"),
  Calendar: page("hiring-manager", "Interview Calendar", "Calendar view with Google and Outlook integration states.", "/interviews/schedule", "/interviews/timeline"),
  Video: page("hiring-manager", "Video Interview Room", "Secure interview room with participants, notes, recording indicator, and feedback handoff.", "/interviews/feedback-forms", "/interviews/timeline"),
  Feedback: page("hiring-manager", "Feedback Forms", "Structured interview feedback forms tied to candidate scorecards and hiring decisions.", "/hiring-manager/decisions", "/interviews/timeline"),
  Timeline: page("hiring-manager", "Interview Timeline", "Chronological view of scheduled, completed, rescheduled, and pending interviews.", "/interviews/calendar", "/messages/direct-chat"),
};


const SystemMonitorPage = () => <Detail title="System Monitoring" items={["System Health", "Server Status", "Database Status", "API Response Time"]} />;
const DatabasePage = () => <Detail title="Database Monitoring" items={["Database Status", "Connections", "Query Latency", "Backup State"]} />;
const ApiAnalyticsPage = () => <Detail title="API Analytics" items={["API Response Time", "Error Rate", "Throughput", "Endpoint Usage"]} />;
const ReportPage = () => <Detail title="Report Page" items={["User Growth", "Job Statistics", "Application Statistics", "Interview Statistics", "Hiring Statistics"]} />;

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/login", Component: () => <Login audience="employee" /> },
  { path: "/employee/login", Component: () => <Login audience="employee" /> },
  { path: "/auth/login", Component: () => <Login audience="employee" /> },
  { path: "/jobseeker/login", Component: () => <Login audience="jobseeker" /> },
  { path: "/job-seeker/login", Component: () => <Navigate to="/jobseeker/login" replace /> },
  { path: "/register", Component: Register },
  { path: "/jobseeker/register", Component: Register },
  { path: "/job-seeker/register", Component: () => <Navigate to="/jobseeker/register" replace /> },
  { path: "/auth/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword }, { path: "/auth/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  { path: "/role-selection", Component: AccessDenied },
  { path: "/access-denied", Component: AccessDenied },
  { path: "/jobseeker/dashboard", Component: () => <Guard roles={["jobseeker"]} Component={JobSeekerDashboard} /> },
  { path: "/jobseeker/profile", Component: () => <Guard roles={["jobseeker"]} Component={JobSeekerProfile} /> },
  { path: "/jobseeker/resume", Component: () => <Guard roles={["jobseeker"]} Component={ResumeManagement} /> },
  { path: "/jobseeker/resume-library", Component: () => <Guard roles={["jobseeker"]} Component={JS.ResumeLibrary} /> },
  { path: "/jobseeker/jobs", Component: () => <Guard roles={["jobseeker"]} Component={JobSearch} /> },
  { path: "/jobseeker/job-details", Component: () => <Guard roles={["jobseeker"]} Component={JS.JobDetails} /> },
  { path: "/jobseeker/apply", Component: () => <Guard roles={["jobseeker"]} Component={JS.Apply} /> },
  { path: "/jobseeker/applications", Component: () => <Guard roles={["jobseeker"]} Component={ApplicationTracking} /> },
  { path: "/jobseeker/saved-jobs", Component: () => <Guard roles={["jobseeker"]} Component={JS.Saved} /> },
  { path: "/jobseeker/ai-recommendations", Component: () => <Guard roles={["jobseeker"]} Component={AIRecommendations} /> },
  { path: "/jobseeker/ai-suite", Component: () => <Guard roles={["jobseeker"]} Component={JobseekerAISuiteView} /> },
  { path: "/jobseeker/interviews", Component: () => <Guard roles={["jobseeker"]} Component={JobSeekerInterviews} /> },
  { path: "/jobseeker/calendar", Component: () => <Guard roles={["jobseeker"]} Component={JobSeekerCalendar} /> },
  { path: "/jobseeker/messages", Component: () => <Guard roles={["jobseeker"]} Component={JobSeekerMessages} /> },
  { path: "/jobseeker/notifications", Component: () => <Guard roles={["jobseeker"]} Component={SeekerNotifications} /> },
  { path: "/jobseeker/settings", Component: () => <Guard roles={["jobseeker"]} Component={SeekerSettings} /> },
  { path: "/recruiter/dashboard", Component: () => <Guard roles={["recruiter"]} Component={RecruiterDashboard} /> },
  { path: "/recruiter/profile", Component: () => <Guard roles={["recruiter"]} Component={RecruiterSettings} /> },
  { path: "/recruiter/company-profile", Component: () => <Guard roles={["recruiter"]} Component={RecruiterSettings} /> },
  { path: "/recruiter/jobs", Component: () => <Guard roles={["recruiter"]} Component={RecruiterJobManagement} /> },
  { path: "/recruiter/job-requisitions", Component: () => <Guard roles={["recruiter"]} Component={RecruiterJobRequisitions} /> },
  { path: "/recruiter/candidates", Component: () => <Guard roles={["recruiter"]} Component={CandidateSearch} /> },
  { path: "/recruiter/applications", Component: () => <Guard roles={["recruiter"]} Component={ResumeReader} /> },
  { path: "/recruiter/shortlisting", Component: () => <Guard roles={["recruiter"]} Component={ResumeReader} /> },
  { path: "/recruiter/ai-ranking", Component: () => <Guard roles={["recruiter"]} Component={RecruiterAISuiteView} /> },
  { path: "/recruiter/candidate-ranking", Component: () => <Navigate to="/recruiter/ai-ranking" replace /> },
  { path: "/recruiter/interviews", Component: () => <Guard roles={["recruiter"]} Component={RecruiterInterviews} /> },
  { path: "/recruiter/interviews/schedule", Component: () => <Guard roles={["recruiter"]} Component={InterviewScheduling} /> },
  { path: "/recruiter/talent-pool", Component: () => <Guard roles={["recruiter"]} Component={CandidateSearch} /> },
  { path: "/recruiter/hiring-managers", Component: () => <Guard roles={["recruiter"]} Component={RecruiterSettings} /> },
  { path: "/recruiter/messages", Component: () => <Guard roles={["recruiter"]} Component={RecruiterMessages} /> },
  { path: "/recruiter/analytics", Component: () => <Guard roles={["recruiter"]} Component={RecruiterDashboard} /> },
  { path: "/recruiter/company-settings", Component: () => <Guard roles={["recruiter"]} Component={RecruiterSettings} /> },
  { path: "/recruiter/settings", Component: () => <Navigate to="/recruiter/company-settings" replace /> },
  { path: "/recruiter/notifications", Component: () => <Guard roles={["recruiter"]} Component={RecruiterNotifications} /> },
  { path: "/hiring-manager/messages", Component: () => <Guard roles={["hiring-manager"]} Component={HMMessages} /> },
  { path: "/hiring-manager/settings", Component: () => <Guard roles={["hiring-manager"]} Component={HMSettings} /> },
  { path: "/hiring-manager/dashboard", Component: () => <Guard roles={["hiring-manager"]} Component={HMDashboard} /> },
  { path: "/hiring-manager/profile", Component: () => <Guard roles={["hiring-manager"]} Component={HMProfile} /> },
  { path: "/hiring-manager/job-requisitions", Component: () => <Guard roles={["hiring-manager"]} Component={JobRequisitions} /> },
  { path: "/hiring-manager/candidates", Component: () => <Guard roles={["hiring-manager"]} Component={Candidates} /> },
  { path: "/hiring-manager/candidate-details", Component: () => <Guard roles={["hiring-manager"]} Component={CandidateDetails} /> },
  { path: "/hiring-manager/reports", Component: () => <Guard roles={["hiring-manager"]} Component={Reports} /> },
  { path: "/hiring-manager/team", Component: () => <Guard roles={["hiring-manager"]} Component={Team} /> },
  { path: "/hiring-manager/notifications", Component: () => <Guard roles={["hiring-manager"]} Component={HMNotifications} /> },
  { path: "/hiring-manager/ai-suite", Component: () => <Guard roles={["hiring-manager"]} Component={HMSuite} /> },
  { path: "/hiring-manager/offer-details", Component: () => <Guard roles={["hiring-manager"]} Component={Decisions} /> },
  { path: "/hiring-manager/assigned-jobs", Component: () => <Guard roles={["hiring-manager"]} Component={AssignedJobs} /> },
  { path: "/hiring-manager/reviews", Component: () => <Guard roles={["hiring-manager"]} Component={Reviews} /> },
  { path: "/hiring-manager/review/:id", Component: () => <Guard roles={["hiring-manager"]} Component={Reviews} /> },
  { path: "/hiring-manager/evaluations", Component: () => <Guard roles={["hiring-manager"]} Component={Evaluations} /> },
  { path: "/hiring-manager/evaluation/:id", Component: () => <Guard roles={["hiring-manager"]} Component={Evaluations} /> },
  { path: "/hiring-manager/scorecard", Component: () => <Guard roles={["hiring-manager"]} Component={Evaluations} /> },
  { path: "/hiring-manager/feedback", Component: () => <Guard roles={["hiring-manager"]} Component={Feedback} /> },
  { path: "/hiring-manager/decisions", Component: () => <Guard roles={["hiring-manager"]} Component={Decisions} /> },
  { path: "/hiring-manager/calendar", Component: () => <Guard roles={["hiring-manager"]} Component={HMCalendar} /> },
  { path: "/hiring-manager/interviews", Component: () => <Guard roles={["hiring-manager"]} Component={Interviews} /> },
  { path: "/hiring-manager/interviews/schedule", Component: () => <Guard roles={["hiring-manager"]} Component={InterviewScheduling} /> },
  { path: "/admin/dashboard", Component: () => <Guard roles={["admin"]} Component={AdminDashboard} /> },
  { path: "/admin/users", Component: () => <Guard roles={["admin"]} Component={UserManagement} /> },
  { path: "/admin/roles", Component: () => <Guard roles={["admin"]} Component={RoleManagement} /> },
  { path: "/admin/organizations", Component: () => <Guard roles={["admin"]} Component={OrganizationManagement} /> },
  { path: "/admin/audit-logs", Component: () => <Guard roles={["admin"]} Component={AuditLogs} /> },
  { path: "/admin/analytics", Component: () => <Guard roles={["admin"]} Component={AnalyticsPage} /> },
  { path: "/admin/monitoring", Component: () => <Guard roles={["admin"]} Component={SystemMonitorPage} /> },
  { path: "/admin/ai-monitoring", Component: () => <Guard roles={["admin"]} Component={AIMonitoring} /> },
  { path: "/admin/settings", Component: () => <Guard roles={["admin"]} Component={AdminSettings} /> },
  { path: "/admin/profile", Component: () => <Guard roles={["admin"]} Component={AdminProfile} /> },
  { path: "/admin/users/profile", Component: () => <Guard roles={["admin"]} Component={UserProfile} /> },
  { path: "/admin/users/:id", Component: () => <Guard roles={["admin"]} Component={UserProfile} /> },
  { path: "/admin/users/edit", Component: () => <Guard roles={["admin"]} Component={UserForm} /> },
  { path: "/admin/users/create", Component: () => <Guard roles={["admin"]} Component={UserForm} /> },
  { path: "/admin/roles/details", Component: () => <Guard roles={["admin"]} Component={() => <Detail title="Role Details" items={["Role Name", "Description", "User Count", "Permissions"]} />} /> },
  { path: "/admin/roles/edit", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Edit Role" fields={["Role Name", "Description"]} />} /> },
  { path: "/admin/roles/create", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Create Role" fields={["Role Name", "Description"]} />} /> },
  { path: "/admin/roles/permissions", Component: () => <Guard roles={["admin"]} Component={PermissionsPage} /> },
  { path: "/admin/organizations/profile", Component: () => <Guard roles={["admin"]} Component={OrganizationProfile} /> },
  { path: "/admin/organizations/create", Component: () => <Guard roles={["admin"]} Component={OrganizationCreateForm} /> },
  { path: "/admin/organizations/edit", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Edit Organization" fields={["Company Name", "Industry", "Plan", "Status"]} />} /> },
  { path: "/admin/organizations/upgrade", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Subscription Upgrade" fields={["Organization", "Current Plan", "New Plan", "Billing Contact"]} />} /> },
  { path: "/admin/organizations/:id", Component: () => <Guard roles={["admin"]} Component={OrganizationProfile} /> },
  { path: "/admin/jobs", Component: () => <Guard roles={["admin"]} Component={JobManagement} /> },
  { path: "/admin/jobs/active", Component: () => <Guard roles={["admin"]} Component={JobManagement} /> },
  { path: "/admin/jobs/closed", Component: () => <Guard roles={["admin"]} Component={JobManagement} /> },
  { path: "/admin/jobs/details", Component: () => <Guard roles={["admin"]} Component={JobDetails} /> },
  { path: "/admin/jobs/edit", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Edit Job" fields={["Job Title", "Company", "Status", "Deadline"]} />} /> },
  { path: "/admin/jobs/create", Component: () => <Guard roles={["admin"]} Component={JobCreateForm} /> },
  { path: "/admin/applications", Component: () => <Guard roles={["admin"]} Component={ApplicationManagement} /> },
  { path: "/admin/applications/:id", Component: () => <Guard roles={["admin"]} Component={ApplicationDetails} /> },
  { path: "/admin/interviews", Component: () => <Guard roles={["admin"]} Component={InterviewManagement} /> },
  { path: "/admin/interviews/:id", Component: () => <Guard roles={["admin"]} Component={InterviewDetails} /> },
  { path: "/admin/interviews/reschedule", Component: () => <Guard roles={["admin"]} Component={() => <FormPage title="Reschedule Interview" fields={["Candidate", "Position", "New Date", "New Time", "Reason"]} />} /> },
  { path: "/admin/reports/hiring", Component: () => <Guard roles={["admin"]} Component={ReportPage} /> },
  { path: "/admin/reports/detail", Component: () => <Guard roles={["admin"]} Component={ReportPage} /> },
  { path: "/admin/ai-analytics", Component: () => <Guard roles={["admin"]} Component={AnalyticsPage} /> },
  { path: "/admin/ai-logs", Component: () => <Guard roles={["admin"]} Component={AILogsTable} /> },
  { path: "/admin/ai-errors/details", Component: () => <Guard roles={["admin"]} Component={() => <Detail title="Error Details" items={["Error Log", "Stack Trace", "Model Context", "Resolution"]} />} /> },
  { path: "/admin/infrastructure", Component: () => <Guard roles={["admin"]} Component={InfrastructurePage} /> },
  { path: "/admin/database", Component: () => <Guard roles={["admin"]} Component={DatabasePage} /> },
  { path: "/admin/api-analytics", Component: () => <Guard roles={["admin"]} Component={ApiAnalyticsPage} /> },
  { path: "/admin/analytics/detail", Component: () => <Guard roles={["admin"]} Component={ReportPage} /> },
  { path: "/admin/audit-logs/details", Component: () => <Guard roles={["admin"]} Component={() => <Detail title="Log Details" items={["User Information", "Activity Information", "Timestamp"]} />} /> },
  { path: "/admin/notifications", Component: () => <Guard roles={["admin"]} Component={Notifications} /> },
  { path: "/ai/resume-parsing", Component: () => <Guard roles={["recruiter", "jobseeker"]} Component={AI.ResumeParsing} /> },
  { path: "/ai/skill-extraction", Component: () => <Guard roles={["recruiter", "jobseeker"]} Component={AI.SkillExtraction} /> },
  { path: "/ai/candidate-ranking", Component: () => <Guard roles={["recruiter"]} Component={AI.CandidateRanking} /> },
  { path: "/ai/candidate-matching", Component: () => <Guard roles={["recruiter"]} Component={AI.CandidateMatching} /> },
  { path: "/ai/hiring-analytics", Component: () => <Guard roles={["recruiter"]} Component={AI.HiringAnalytics} /> },
  { path: "/ai/hiring-trends", Component: () => <Guard roles={["recruiter"]} Component={AI.HiringTrends} /> },
  { path: "/ai/recommendations", Component: () => <Guard roles={["jobseeker"]} Component={AIRecommendations} /> },
  { path: "/ai/analytics", Component: () => <Navigate to="/ai/hiring-analytics" replace /> },
  { path: "/interviews/schedule", Component: () => <Guard roles={["recruiter", "hiring-manager"]} Component={InterviewScheduling} /> },
  { path: "/interviews/calendar", Component: () => <Guard roles={["recruiter", "hiring-manager", "jobseeker"]} Component={I.Calendar} /> },
  { path: "/interviews/video-room", Component: () => <Guard roles={["hiring-manager", "jobseeker", "recruiter", "admin"]} Component={VideoInterview} /> },
  { path: "/interviews/feedback-forms", Component: () => <Guard roles={["hiring-manager"]} Component={I.Feedback} /> },
  { path: "/interviews/timeline", Component: () => <Guard roles={["recruiter", "hiring-manager"]} Component={I.Timeline} /> },
  { path: "/interview/:id", Component: () => <Guard roles={["jobseeker", "recruiter", "hiring-manager"]} Component={VideoInterview} /> },
  { path: "/messages/inbox", Component: () => <Guard roles={["jobseeker", "recruiter", "hiring-manager"]} Component={InboxRouter} /> },
  { path: "/messages/chat-list", Component: () => <Navigate to="/messages/inbox" replace /> },
  { path: "/messages/direct-chat", Component: () => <Guard roles={["jobseeker", "recruiter", "hiring-manager"]} Component={M.DirectChat} /> },
  { path: "/messages/email-center", Component: () => <Guard roles={["recruiter"]} Component={M.Email} /> },
  { path: "/messages/notifications", Component: () => <Guard roles={["jobseeker", "recruiter", "hiring-manager"]} Component={NotificationsRouter} /> },
  { path: "/job-seeker/profile", Component: () => <Navigate to="/jobseeker/profile" replace /> },
  { path: "/job-seeker/job-search", Component: () => <Navigate to="/jobseeker/jobs" replace /> },
  { path: "/job-seeker/interviews", Component: () => <Navigate to="/jobseeker/interviews" replace /> },
  { path: "/seeker/*", Component: () => <Navigate to="/jobseeker/dashboard" replace /> },
  { path: "/manager/*", Component: () => <Navigate to="/hiring-manager/dashboard" replace /> },
  { path: "/analytics", Component: () => <Navigate to="/admin/analytics" replace /> },
  { path: "*", Component: NotFound },
];

export const router = createBrowserRouter(routes);
export const routeMap = routes.map((route) => route.path);
