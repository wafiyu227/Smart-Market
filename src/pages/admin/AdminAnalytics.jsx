// src/pages/admin/AdminAnalytics.jsx
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Store,
  Package,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabaseClient";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");
  const [stats, setStats] = useState({
    userGrowth: [],
    shopGrowth: [],
    categoryDistribution: [],
    locationDistribution: [],
    subscriptionStats: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // User Growth Data
      const { data: userGrowthData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      // Shop Growth Data
      const { data: shopGrowthData } = await supabase
        .from("shops")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      // Category Distribution
      const { data: categoryData } = await supabase
        .from("shops")
        .select("category");

      // Location Distribution
      const { data: locationData } = await supabase
        .from("shops")
        .select("location");

      // Subscription Stats
      const { data: subscriptionData } = await supabase
        .from("profiles")
        .select("subscription_tier");

      setStats({
        userGrowth: processTimeSeriesData(userGrowthData, days),
        shopGrowth: processTimeSeriesData(shopGrowthData, days),
        categoryDistribution: processCategoryData(categoryData),
        locationDistribution: processLocationData(locationData),
        subscriptionStats: processSubscriptionData(subscriptionData),
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const processTimeSeriesData = (data, days) => {
    if (!data) return [];

    const grouped = {};
    const today = new Date();

    // Initialize all dates
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      grouped[dateStr] = 0;
    }

    // Count items per date
    data.forEach((item) => {
      const date = new Date(item.created_at);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (grouped[dateStr] !== undefined) {
        grouped[dateStr]++;
      }
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const processCategoryData = (data) => {
    if (!data) return [];

    const grouped = {};
    data.forEach((item) => {
      const category = item.category || "Uncategorized";
      grouped[category] = (grouped[category] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const processLocationData = (data) => {
    if (!data) return [];

    const grouped = {};
    data.forEach((item) => {
      const location = item.location || "Unknown";
      grouped[location] = (grouped[location] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processSubscriptionData = (data) => {
    if (!data) return [];

    const grouped = { free: 0, pro: 0 };
    data.forEach((item) => {
      const tier = item.subscription_tier || "free";
      grouped[tier] = (grouped[tier] || 0) + 1;
    });

    return [
      { name: "Free", value: grouped.free, color: "#6B7280" },
      { name: "Pro", value: grouped.pro, color: "#8B5CF6" },
    ];
  };

  const COLORS = ["#4F46E5", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#6366F1"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform insights and trends</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {["7days", "30days", "90days"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range === "7days" ? "7 Days" : range === "30days" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Users</p>
          <p className="text-3xl font-bold">
            {stats.userGrowth.reduce((sum, item) => sum + item.count, 0)}
          </p>
          <p className="text-xs opacity-80 mt-2">Last {timeRange === "7days" ? "7" : timeRange === "30days" ? "30" : "90"} days</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Store className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">New Shops</p>
          <p className="text-3xl font-bold">
            {stats.shopGrowth.reduce((sum, item) => sum + item.count, 0)}
          </p>
          <p className="text-xs opacity-80 mt-2">Last {timeRange === "7days" ? "7" : timeRange === "30days" ? "30" : "90"} days</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 opacity-80" />
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Categories</p>
          <p className="text-3xl font-bold">{stats.categoryDistribution.length}</p>
          <p className="text-xs opacity-80 mt-2">Active categories</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 opacity-80" />
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Locations</p>
          <p className="text-3xl font-bold">{stats.locationDistribution.length}</p>
          <p className="text-xs opacity-80 mt-2">Cities covered</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shop Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shop Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.shopGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="New Shops"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shop Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription Tiers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.subscriptionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Users">
                {stats.subscriptionStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Locations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Top Locations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.locationDistribution.map((location, index) => {
                const total = stats.locationDistribution.reduce((sum, l) => sum + l.value, 0);
                const percentage = ((location.value / total) * 100).toFixed(1);
                return (
                  <tr key={location.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}