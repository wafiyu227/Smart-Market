import { useState } from "react";
import { Store, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
  
    try {
      // Step 1: Sign in user
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
  
      if (authError) throw authError;
  
      const user = authData.user;
  
      // Step 2: Check if user is admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();
  
      // Step 3: Ensure profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
  
      if (!profileData && !profileError) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0],
          phone: user.user_metadata?.phone || null,
        });
  
        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }
  
      setMessage({
        type: "success",
        text: "🎉 Welcome back! Redirecting...",
      });
  
      // Step 4: Redirect based on role
      if (adminData) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login error:", error);
  
      let errorMessage = "Something went wrong. Please try again.";
  
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage =
          "Please verify your email address before signing in.";
      } else if (error.message?.includes("User not found")) {
        errorMessage =
          "No account found with this email. Please sign up first.";
      }
  
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="/pwa-192x192.png" className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Market
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Welcome back to your marketplace
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sign In
          </h2>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === "success" ? (
                    <LogIn className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 text-sm">{message.text}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-50"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-50"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Secure sign in protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}