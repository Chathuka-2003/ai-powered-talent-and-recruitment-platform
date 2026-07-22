export const API_BASE_URL = "http://localhost:5047/api";
export const BACKEND_URL = "http://localhost:5047";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const headers: any = {
    ...(options.headers || {}),
  };

  // Only add application/json if not explicitly overridden (e.g. for FormData)
  if (!("Content-Type" in headers) && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const storedUser = localStorage.getItem("talentai.user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch {}
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorData: any = {};
    try {
      if (errorText) errorData = JSON.parse(errorText);
    } catch {}
    console.error("API Error Response Data:", errorData);
    const detail = errorData.errors ? JSON.stringify(errorData.errors) : "";
    const errorMessage = errorData.error || errorData.message || (detail ? `Validation Failed: ${detail}` : `Request failed with status ${response.status}`);
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text);
}

export const api = {
  organizations: {
    getByUserId: async (userId: string) => {
      return request<any>(`organizations/by-user/${userId}`);
    },
    getById: async (orgId: string) => {
      return request<any>(`organizations/${orgId}`);
    },
    create: async (data: any) => {
      return request<any>("organizations", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (orgId: string, data: any) => {
      return request<{ message: string }>(`organizations/${orgId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    addRecruiter: async (orgId: string, data: any) => {
      return request<any>(`organizations/${orgId}/recruiters`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    removeRecruiter: async (orgId: string, recruiterId: string) => {
      return request<{ message: string }>(`organizations/${orgId}/recruiters/${recruiterId}`, {
        method: "DELETE",
      });
    },
    addHiringManager: async (orgId: string, data: any) => {
      return request<any>(`organizations/${orgId}/hiring-managers`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    removeHiringManager: async (orgId: string, managerId: string) => {
      return request<{ message: string }>(`organizations/${orgId}/hiring-managers/${managerId}`, {
        method: "DELETE",
      });
    },
  },
  auth: {
    login: async (email: string, password: string) => {
      return request<{ id: string; firstName: string; lastName: string; email: string; role: string; token: string }>(
        "auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
    },
    register: async (firstName: string, lastName: string, email: string, password: string) => {
      return request<{ id: string; firstName: string; lastName: string; email: string; role: string; token: string }>(
        "auth/register",
        {
          method: "POST",
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );
    },
    registerRecruiter: async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      companyName: string,
      jobTitle: string,
      department: string,
      phoneNumber: string
    ) => {
      return request<{ id: string; firstName: string; lastName: string; email: string; role: string; token: string }>(
        "auth/register-recruiter",
        {
          method: "POST",
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            companyName,
            jobTitle,
            department,
            phoneNumber,
          }),
        }
      );
    },
  },
  jobs: {
    getAll: async (params?: { title?: string; location?: string; employmentType?: string; minSalary?: number; maxSalary?: number; recruiterId?: string; organizationId?: string }) => {
      const qs = params ? '?' + Object.entries(params).filter(([,v]) => v !== undefined && v !== '').map(([k,v]) => `${k}=${encodeURIComponent(v!)}`).join('&') : '';
      return request<any[]>(`jobs${qs}`);
    },
    getById: async (id: string) => {
      return request<any>(`jobs/${id}`);
    },
    create: async (jobData: any) => {
      return request<any>("jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      });
    },
    update: async (id: string, jobData: any) => {
      return request<void>(`jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(jobData),
      });
    },
    delete: async (id: string) => {
      return request<void>(`jobs/${id}`, {
        method: "DELETE",
      });
    },
  },
  recruiters: {
    getProfile: async (userId: string) => {
      return request<any>(`recruiters/profile/${userId}`);
    },
    updateProfile: async (userId: string, data: any) => {
      return request<void>(`recruiters/profile/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
  },
  applications: {
    apply: async (candidateId: string, jobId: string, aiMatchScore?: number) => {
      return request<{ message: string; id: string }>("applications", {
        method: "POST",
        body: JSON.stringify({ candidateId, jobId, aiMatchScore }),
      });
    },
    getById: async (applicationId: string) => {
      return request<any>(`applications/${applicationId}`);
    },
    getByCandidate: async (candidateId: string) => {
      return request<any[]>(`applications/candidate/${candidateId}`);
    },
    check: async (candidateId: string, jobId: string) => {
      return request<{ applied: boolean }>(`applications/check?candidateId=${candidateId}&jobId=${jobId}`);
    },
    withdraw: async (applicationId: string) => {
      return request<void>(`applications/${applicationId}`, { method: "DELETE" });
    },
    getForRecruiter: async (userId: string) => {
      return request<any[]>(`applications/recruiter/${userId}`);
    },
    updateStatus: async (applicationId: string, status: string) => {
      return request<{ message: string; status: string }>(`applications/${applicationId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
    },
  },
  interviews: {
    create: async (data: any) => {
      return request<{ message: string; id: string; syncResults?: any[] }>("interviews", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getById: async (interviewId: string) => {
      return request<any>(`interviews/${interviewId}`);
    },
    getByCandidate: async (candidateId: string) => {
      return request<any[]>(`interviews/candidate/${candidateId}`);
    },
    getByRecruiter: async (recruiterId: string) => {
      return request<any[]>(`interviews/recruiter/${recruiterId}`);
    },
    getByHiringManager: async (hiringManagerId: string) => {
      return request<any[]>(`interviews/hiringmanager/${hiringManagerId}`);
    },
    updateStatus: async (interviewId: string, status: string) => {
      return request<void>(`interviews/${interviewId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
  },
  calendar: {
    getConnections: async (userId: string) => {
      return request<any[]>(`calendar/connections?userId=${userId}`);
    },
    getAuthUrl: async (provider: string, userId: string) => {
      return request<{ url: string }>(`calendar/${provider}/auth-url?userId=${userId}`);
    },
    handleCallback: async (provider: string, userId: string, code: string) => {
      return request<any>(`calendar/${provider}/callback`, {
        method: "POST",
        body: JSON.stringify({ userId, code }),
      });
    },
    updatePreferences: async (userId: string, autoSync: boolean, reminderMinutes: number) => {
      return request<any>(`calendar/preferences`, {
        method: "PUT",
        body: JSON.stringify({ userId, autoSync, reminderMinutes }),
      });
    },
    disconnect: async (provider: string, userId: string) => {
      return request<any>(`calendar/${provider}?userId=${userId}`, { method: "DELETE" });
    },
    syncInterview: async (interviewId: string, userId: string) => {
      return request<any>(`calendar/sync/${interviewId}?userId=${userId}`, { method: "POST" });
    },
  },
  savedJobs: {
    getByCandidate: async (candidateId: string) => {
      return request<any[]>(`savedjobs/candidate/${candidateId}`);
    },
    save: async (candidateId: string, jobId: string) => {
      return request<{ message: string; id: string }>("savedjobs", {
        method: "POST",
        body: JSON.stringify({ candidateId, jobId }),
      });
    },
    unsave: async (candidateId: string, jobId: string) => {
      return request<void>(`savedjobs/${candidateId}/${jobId}`, { method: "DELETE" });
    },
    check: async (candidateId: string, jobId: string) => {
      return request<{ saved: boolean }>(`savedjobs/check?candidateId=${candidateId}&jobId=${jobId}`);
    },
  },
  ai: {
    analyzeProfile: async (candidateId: string) => {
      return request<any>("ai/analyze-profile", {
        method: "POST",
        body: JSON.stringify({ candidateId }),
      });
    },
    matchJob: async (candidateId: string, jobId: string) => {
      return request<any>("ai/match-job", {
        method: "POST",
        body: JSON.stringify({ candidateId, jobId }),
      });
    },
    hmResumeScreening: async (candidateId: string, jobId: string) => {
      return request<any>("ai/hm-resume-screening", {
        method: "POST",
        body: JSON.stringify({ candidateId, jobId }),
      });
    },
    hmCandidateRanking: async (jobId: string, candidateIds: string[]) => {
      return request<any>("ai/hm-candidate-ranking", {
        method: "POST",
        body: JSON.stringify({ jobId, candidateIds }),
      });
    },
    hmInterviewQuestions: async (candidateId: string, jobId: string) => {
      return request<string[]>("ai/hm-interview-questions", {
        method: "POST",
        body: JSON.stringify({ candidateId, jobId }),
      });
    },
    hmGenerateJd: async (title: string, keywords: string, experienceLevel: string) => {
      return request<any>("ai/hm-generate-jd", {
        method: "POST",
        body: JSON.stringify({ title, keywords, experienceLevel }),
      });
    },
    suiteGenerate: async (moduleType: string, candidateId?: string, jobId?: string) => {
      return request<any>("ai/suite-generate", {
        method: "POST",
        body: JSON.stringify({ moduleType, candidateId, jobId }),
      });
    },
  },
  candidates: {
    getAll: async () => {
      return request<any[]>("candidates");
    },
    getById: async (id: string) => {
      return request<any>(`candidates/${id}`);
    },
    getByUserId: async (userId: string) => {
      return request<any>(`candidates/user/${userId}`);
    },
    ensure: async (userId: string) => {
      return request<any>(`candidates/ensure/${userId}`, { method: "POST" });
    },
    recordView: async (id: string) => {
      return request<{ views: number }>(`candidates/${id}/view`, { method: "POST" });
    },
    update: async (id: string, candidateData: any) => {
      return request<void>(`candidates/${id}`, {
        method: "PUT",
        body: JSON.stringify(candidateData),
      });
    },
    uploadResume: async (id: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request<{ resumeFileName: string; resumeUrl: string; resumeUploadedAt: string }>(`candidates/${id}/resume`, {
        method: "POST",
        body: formData,
      });
    },
    deleteResume: async (id: string) => {
      return request<void>(`candidates/${id}/resume`, {
        method: "DELETE",
      });
    },
    education: {
      getAll: async (candidateId: string) => {
        return request<any[]>(`candidates/${candidateId}/education`);
      },
      add: async (candidateId: string, data: any) => {
        return request<any>(`candidates/${candidateId}/education`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
      delete: async (candidateId: string, eduId: string) => {
        return request<void>(`candidates/${candidateId}/education/${eduId}`, {
          method: "DELETE",
        });
      },
    },
    experience: {
      getAll: async (candidateId: string) => {
        return request<any[]>(`candidates/${candidateId}/experience`);
      },
      add: async (candidateId: string, data: any) => {
        return request<any>(`candidates/${candidateId}/experience`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
      delete: async (candidateId: string, expId: string) => {
        return request<void>(`candidates/${candidateId}/experience/${expId}`, {
          method: "DELETE",
        });
      },
    },
    skills: {
      getAll: async (candidateId: string) => {
        return request<any[]>(`candidates/${candidateId}/skills`);
      },
      add: async (candidateId: string, data: any) => {
        return request<any>(`candidates/${candidateId}/skills`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
      delete: async (candidateId: string, csId: string) => {
        return request<void>(`candidates/${candidateId}/skills/${csId}`, {
          method: "DELETE",
        });
      },
    },
  },
  messages: {
    getConversations: async (userId: string) => {
      return request<any[]>(`messages/${userId}`);
    },
    getConversation: async (userId: string, peerId: string) => {
      return request<any[]>(`messages/conversation/${userId}/${peerId}`);
    },
    send: async (senderId: string, receiverId: string, content: string) => {
      return request<any>("messages", {
        method: "POST",
        body: JSON.stringify({ senderId, receiverId, content }),
      });
    },
    markAsRead: async (id: string) => {
      return request<void>(`messages/${id}/read`, { method: "PUT" });
    },
  },
  notifications: {
    getByUser: async (userId: string) => {
      return request<any[]>(`notifications/${userId}`);
    },
    create: async (userId: string, title: string, messageText: string) => {
      return request<any>("notifications", {
        method: "POST",
        body: JSON.stringify({ userId, title, messageText }),
      });
    },
    markAsRead: async (id: string) => {
      return request<void>(`notifications/${id}/read`, { method: "PUT" });
    },
    markAllAsRead: async (userId: string) => {
      return request<void>(`notifications/read-all/${userId}`, { method: "PUT" });
    }
  },
  users: {
    getContacts: async (userId: string) => {
      return request<any[]>(`users/contacts/${userId}`);
    },
    updateSettings: async (id: string, data: { firstName: string; lastName: string; email: string }) => {
      return request<any>(`users/${id}/settings`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    changePassword: async (id: string, data: { oldPassword: string; newPassword: string }) => {
      return request<any>(`users/${id}/password`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
  },
  hiringManager: {
    getProfile: async (id: string) => request<any>(`hiringManagers/${id}/profile`),
    updateProfile: async (id: string, data: any) => request<any>(`hiringManagers/${id}/profile`, { method: "PUT", body: JSON.stringify(data) }),
    getAssignedJobs: async (id: string) => request<any[]>(`hiringManagers/${id}/assigned-jobs`),
    getCandidates: async (id: string) => request<any[]>(`hiringManagers/${id}/candidates`),
    getInterviews: async (id: string) => request<any[]>(`hiringManagers/${id}/interviews`),
    getShortlisted: async (id: string) => request<any[]>(`hiringManagers/${id}/shortlisted`),
    getShortlistedCandidates: async (id: string) => request<any[]>(`hiringManagers/${id}/shortlisted`),
    getEvaluations: async (id: string) => request<any[]>(`hiringManagers/${id}/evaluations`),
    submitEvaluation: async (id: string, data: any) => request<any>(`hiringManagers/${id}/evaluations`, { method: "POST", body: JSON.stringify(data) }),
    getFeedback: async (id: string) => request<any[]>(`hiringManagers/${id}/feedback`),
    submitFeedback: async (id: string, data: any) => request<any>(`hiringManagers/${id}/feedback`, { method: "POST", body: JSON.stringify(data) }),
    getDecisions: async (id: string) => request<any[]>(`hiringManagers/${id}/decisions`),
    submitDecision: async (id: string, data: any) => request<any>(`hiringManagers/${id}/decisions`, { method: "POST", body: JSON.stringify(data) }),
    updateDecision: async (id: string, decisionId: string, data: any) => request<any>(`hiringManagers/${id}/decisions/${decisionId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteDecision: async (id: string, decisionId: string) => request<any>(`hiringManagers/${id}/decisions/${decisionId}`, { method: "DELETE" }),
    getReports: async (id: string) => request<any>(`hiringManagers/${id}/reports`),
    getTeam: async (id: string) => request<any[]>(`hiringManagers/${id}/team`),
  },
  jobRequisitions: {
    getByHiringManager: async (hmId: string) => request<any[]>(`jobRequisitions/hiringManager/${hmId}`),
    getByOrganization: async (orgId: string) => request<any[]>(`jobRequisitions/organization/${orgId}`),
    create: async (data: any) => request<any>("jobRequisitions", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: async (id: string, status: string) => request<any>(`jobRequisitions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    })
  },
  talentPools: {
    getByRecruiter: async (recruiterId: string) => {
      return request<any[]>(`talentPools/recruiter/${recruiterId}`);
    },
    add: async (data: { recruiterId: string; candidateId: string; status?: string; notes?: string }) => {
      return request<any>("talentPools", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    remove: async (id: string) => {
      return request<void>(`talentPools/${id}`, {
        method: "DELETE",
      });
    }
  },
  admin: {
    getDashboardStats: async () => request<any>("admin/dashboard-stats"),
    getAllUsers: async () => request<any[]>("users"),
    getUserById: async (id: string) => request<any>(`users/${id}`),
    updateUserRole: async (id: string, role: number) => request<any>(`users/${id}/role`, { method: "PUT", body: JSON.stringify(role) }),
    updateUserStatus: async (id: string, isActive: boolean) => request<any>(`users/${id}/status`, { method: "PUT", body: JSON.stringify(isActive) }),
    deleteUser: async (id: string) => request<any>(`users/${id}`, { method: "DELETE" }),
    getAllOrganizations: async () => request<any[]>("organizations"),
    getAllApplications: async () => request<any[]>("applications/all"),
    getAllInterviews: async () => request<any[]>("interviews/all"),
    getAiLogs: async () => request<any[]>("admin/ai-logs"),
    getSettings: async () => request<any>("admin/settings"),
    updateSettings: async (settings: { key: string, value: string }[]) => request<any>("admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    }),
    deleteSetting: async (key: string) => request<any>(`admin/settings/${key}`, {
      method: "DELETE"
    }),
    getInfrastructureStats: async () => request<any>("admin/infrastructure-stats"),
  }
};
