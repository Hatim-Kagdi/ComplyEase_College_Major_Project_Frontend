import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);
      const data = response.data;

      login(data);

      const { role, approvalStatus } = data;

      // 3. Navigation Logic
      if (role === "ROLE_CA") {
        if (approvalStatus !== "APPROVED") {
          navigate("/ca/pending-approval", { replace: true });
        } else {
          navigate("/ca/dashboard", { replace: true });
        }
      } else if (role === "ROLE_USER") {
        navigate("/user/dashboard", { replace: true });
      } else if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true }); // Fallback
      }

    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-blue-700 tracking-tight">
            ComplyEase
          </Link>
          <p className="text-slate-500 mt-2">Secure Compliance Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-5"
        >
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
              <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : "Sign In"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-2">
            Don't have an account?
            <Link
              to="/register"
              className="text-blue-600 font-bold ml-1 hover:underline"
            >
              Join ComplyEase
            </Link>
          </p>
        </form>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-400 text-sm hover:text-slate-600 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;