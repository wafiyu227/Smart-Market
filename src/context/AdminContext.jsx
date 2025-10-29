// src/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./Authcontext";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminData(null);
      setLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        setAdminData(data);
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  // Log admin activity
  const logActivity = async (
    action,
    resourceType,
    resourceId = null,
    details = null
  ) => {
    try {
      const { error } = await supabase.rpc("log_admin_activity", {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging admin activity:", error);
    }
  };

  // Get dashboard statistics
  const getDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_dashboard_stats")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  };

  // Get all users with pagination
  const getUsers = async (page = 1, limit = 20, search = "") => {
    try {
      let query = supabase
        .from("user_activity_summary")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { users: data, total: count };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], total: 0 };
    }
  };

  // Get all shops with pagination
  const getShops = async (page = 1, limit = 20, search = "") => {
    try {
      let query = supabase
        .from("shops")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { shops: data, total: count };
    } catch (error) {
      console.error("Error fetching shops:", error);
      return { shops: [], total: 0 };
    }
  };

  // Update user status
  const updateUserStatus = async (userId, updates) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      await logActivity("update_user", "user", userId, updates);
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error };
    }
  };

  // Delete shop
  const deleteShop = async (shopId) => {
    try {
      const { error } = await supabase.from("shops").delete().eq("id", shopId);

      if (error) throw error;

      await logActivity("delete_shop", "shop", shopId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting shop:", error);
      return { success: false, error };
    }
  };

  // Get reported content
  const getReportedContent = async (status = "pending") => {
    try {
      let query = supabase
        .from("reported_content")
        .select(
          `
          *,
          reporter:users!reporter_id(email, full_name),
          reviewer:admin_users!reviewed_by(email)
        `
        )
        .order("created_at", { ascending: false });

      if (status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching reported content:", error);
      return [];
    }
  };

  // Update report status
  const updateReportStatus = async (reportId, status) => {
    try {
      const { error } = await supabase
        .from("reported_content")
        .update({
          status,
          reviewed_by: adminData.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      if (error) throw error;

      await logActivity("update_report", "report", reportId, { status });
      return { success: true };
    } catch (error) {
      console.error("Error updating report:", error);
      return { success: false, error };
    }
  };

  // Get admin activity logs
  const getActivityLogs = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select(
          `
          *,
          admin_users(email, role)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
  };

  const value = {
    isAdmin,
    adminData,
    loading,
    logActivity,
    getDashboardStats,
    getUsers,
    getShops,
    updateUserStatus,
    deleteShop,
    getReportedContent,
    updateReportStatus,
    getActivityLogs,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
