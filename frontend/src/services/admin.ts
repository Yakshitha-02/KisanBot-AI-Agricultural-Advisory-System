import api from "./api";

export interface DashboardStats {
  total_users: number;
  total_farmers: number;
  total_admins: number;
  active_users: number;
  inactive_users: number;
  total_sessions: number;
  total_messages: number;
  total_feedback: number;
  positive_feedback: number;
  negative_feedback: number;
  positive_percentage: number;
  negative_percentage: number;
}

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface UnansweredQuery {
  id: number;
  question: string;
  confidence: number;
  resolved: boolean;
  created_at: string;
}

export const adminService = {
  getDashboard() {
    return api.get<DashboardStats>("/admin/dashboard");
  },

  getUsers() {
    return api.get<AdminUser[]>("/admin/users");
  },

  toggleUser(userId: number) {
    return api.patch(`/admin/users/${userId}`);
  },

  deleteUser(userId: number) {
    return api.delete(`/admin/users/${userId}`);
  },

  getUnansweredQueries() {
    return api.get<UnansweredQuery[]>("/admin/unanswered");
  },

  resolveQuery(queryId: number) {
    return api.patch(`/admin/unanswered/${queryId}`);
  },
};