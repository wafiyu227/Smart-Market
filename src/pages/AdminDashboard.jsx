// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Package,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AdminDashboard() {
  const { getDashboardStats, getReportedContent, getActivityLogs } = useAdmin();
  const [stats, setStats] = useState(null);
  const [pendingReports, setPendingReports] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, reportsData, activityData] = await Promise.all([
        getDashboardStats(),
        getReportedContent("pending"),
        getActivityLogs(10),
      ]);

      setStats(statsData);
      setPendingReports(reportsData.slice(0, 5));
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Users",
      value: stats?.total_users || 0,
      change: stats?.new_users_week || 0,
      changeLabel: "this week",
      icon: Users,
      color: "indigo",
      link: "/admin/users",
    },
    {
      name: "Total Shops",
      value: stats?.total_shops || 0,
      change: stats?.new_shops_week || 0,
      changeLabel: "this week",
      icon: Store,
      color: "purple",
      link: "/admin/shops",
    },
    {
      name: "Total Products",
      value: stats?.total_products || 0,
      change: 0,
      changeLabel: "active",
      icon: Package,
      color: "green",
      link: "/admin/shops",
    },
    {
      name: "Pending Reports",
      value: stats?.pending_reports || 0,
      change: 0,
      changeLabel: "need review",
      icon: AlertCircle,
      color: "red",
      link: "/admin/reports",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                {stat.change > 0 && (
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>+{stat.change}</span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.changeLabel}</p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Pending Reports</h2>
            <Link
              to="/admin/reports"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {pendingReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending reports</p>
          ) : (
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {report.content_type} Report
                    </p>
                    <p className="text-sm text-gray-600 truncate">{report.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.admin_users?.email}
                      </span>{" "}
                      {activity.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
          >
            <Users className="w-6 h-6 mb-2" />
            <p className="font-medium">Manage Users</p>
          </Link>
          <Link
            to="/admin/shops"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
          >
            <Store className="w-6 h-6 mb-2" />
            <p className="font-medium">View Shops</p>
          </Link>
          <Link
            to="/admin/reports"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
          >
            <AlertCircle className="w-6 h-6 mb-2" />
            <p className="font-medium">Review Reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
}