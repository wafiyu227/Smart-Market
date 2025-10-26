import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <img src="/pwa-192x192.png" className="w-12 h-12 text-white" />
        <button
          onClick={signOut}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          Sign Out
        </button>
      </nav>

      {/* Hero / Welcome */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Hi, {user.email?.split("@")[0]} 👋
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          Welcome to <span className="font-semibold">Smart Market</span> — your
          local online space to sell and buy effortlessly. Manage your products,
          chat with customers, and grow your business easily.
        </p>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium mb-2 text-indigo-600">
              🛍️ Create Products
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Add your items with photos, prices, and descriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium mb-2 text-indigo-600">
              📊 My Shop
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              View your shop profile and see your active listings.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Open Shop
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium mb-2 text-indigo-600">
              💬 Messages
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Buyers connect with you directly via Whatsapp
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t mt-10">
        © {new Date().getFullYear()} Smart Market. All rights reserved.
      </footer>
    </div>
  );
}
