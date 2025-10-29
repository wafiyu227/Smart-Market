// src/pages/admin/AdminReports.jsx
import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminReports() {
  const { getReportedContent, updateReportStatus } = useAdmin();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReportedContent(filter);
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, status) => {
    const result = await updateReportStatus(reportId, status);
    if (result.success) {
      loadReports();
    } else {
      alert("Failed to update report status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reported Content</h1>
          <p className="text-gray-600 mt-1">Review and moderate reported items</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {["pending", "reviewed", "resolved", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Report Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {report.content_type} Report
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reported by: {report.reporter?.email || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="ml-13 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                    <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                      {report.reason}
                    </p>
                  </div>

                  {report.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Additional Details:
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {report.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Content ID:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {report.content_id}
                    </code>
                  </div>

                  {report.reviewed_by && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Reviewed by:</span>{" "}
                      {report.reviewer?.email} on{" "}
                      {new Date(report.reviewed_at).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {report.status === "pending" && (
                  <div className="ml-13 mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(report.id, "reviewed")}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Mark as Reviewed</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, "resolved")}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, "dismissed")}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}

                {report.status === "reviewed" && (
                  <div className="ml-13 mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(report.id, "resolved")}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, "dismissed")}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-800 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {reports.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">Reviewed</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {reports.filter((r) => r.status === "reviewed").length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-800 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {reports.filter((r) => r.status === "resolved").length}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-800 font-medium">Dismissed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "dismissed").length}
          </p>
        </div>
      </div>
    </div>
  );
}