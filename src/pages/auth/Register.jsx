import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(formData);
      setIsSuccess(true);
      // Wait 2 seconds so they can see the success message before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration Error:", error);
      setError(error.response?.data?.message || "Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-blue-700 tracking-tight">
            ComplyEase
          </Link>
          <p className="text-slate-500 mt-2">Join the future of compliance management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-5"
        >
          <h1 className="text-2xl font-bold text-slate-800 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm text-center font-medium border border-emerald-100">
              Success! Redirecting to login...
            </div>
          )}

          {/* Role Selection - Professional Cards instead of Select */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div
              onClick={() => setFormData({ ...formData, role: "ROLE_USER" })}
              className={`cursor-pointer p-4 rounded-2xl border-2 text-center transition-all ${
                formData.role === "ROLE_USER"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className={`text-xl mb-1 ${formData.role === "ROLE_USER" ? "opacity-100" : "opacity-50"}`}>🏢</div>
              <p className={`text-sm font-bold ${formData.role === "ROLE_USER" ? "text-blue-700" : "text-slate-500"}`}>Business</p>
            </div>
            <div
              onClick={() => setFormData({ ...formData, role: "ROLE_CA" })}
              className={`cursor-pointer p-4 rounded-2xl border-2 text-center transition-all ${
                formData.role === "ROLE_CA"
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className={`text-xl mb-1 ${formData.role === "ROLE_CA" ? "opacity-100" : "opacity-50"}`}>🎓</div>
              <p className={`text-sm font-bold ${formData.role === "ROLE_CA" ? "text-emerald-700" : "text-slate-500"}`}>Professional CA</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Full Name..."
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email Id..."
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isSuccess}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-white transition shadow-lg ${
              loading || isSuccess
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>

          <p className="text-center text-slate-500 text-sm mt-2">
            Already have an account?
            <Link to="/login" className="text-blue-600 font-bold ml-1 hover:underline">
              Log In
            </Link>
          </p>
        </form>

        <p className="text-center mt-8 text-slate-400 text-xs px-10">
          By registering, you agree to ComplyEase's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;