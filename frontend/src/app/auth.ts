export type UserRole = "jobseeker" | "recruiter" | "hiring-manager" | "admin";
export type AuthAudience = "jobseeker" | "employee";

export const dashboardByRole: Record<UserRole, string> = {
  jobseeker: "/jobseeker/dashboard",
  recruiter: "/recruiter/dashboard",
  "hiring-manager": "/hiring-manager/dashboard",
  admin: "/admin/dashboard",
};

export function getLoginPathForRole(role: UserRole | null) {
  return role === "jobseeker" ? "/jobseeker/login" : "/employee/login";
}

export function getDefaultLoginPathForPath(pathname: string) {
  return pathname.startsWith("/jobseeker") || pathname.startsWith("/job-seeker") || pathname.startsWith("/seeker")
    ? "/jobseeker/login"
    : "/employee/login";
}

export function getAuthenticatedUserRole(email: string): UserRole | "invalid" {
  const value = email.toLowerCase();
  if (value.includes("admin")) return "admin";
  if (value.includes("manager") || value.includes("hiring")) return "hiring-manager";
  if (value.includes("recruiter") || value.includes("employer")) return "recruiter";
  if (value.includes("invalid")) return "invalid";
  return "jobseeker";
}

export function isRoleAllowedForAudience(role: UserRole, audience: AuthAudience) {
  return audience === "jobseeker" ? role === "jobseeker" : role !== "jobseeker";
}

export function setCurrentRole(role: UserRole) {
  localStorage.setItem("talentai.role", role);
}

export function getCurrentRole(): UserRole | null {
  const role = localStorage.getItem("talentai.role");
  return role === "jobseeker" || role === "recruiter" || role === "hiring-manager" || role === "admin" ? role : null;
}

export function clearCurrentRole() {
  localStorage.removeItem("talentai.role");
}

export function getCurrentUser() {
  const user = localStorage.getItem("talentai.user");
  return user ? JSON.parse(user) : null;
}

export function getUserId() {
  const user = getCurrentUser();
  // Depending on whether it's 'id', 'userId', or maybe even inside user.profile
  return user?.id || user?.userId || null;
}

export function logoutUser() {
  localStorage.removeItem("talentai.role");
  localStorage.removeItem("talentai.user");
}
