import React, { useState } from "react";
import { Camera } from "lucide-react";
import { authApi } from "../../api/api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify({ username: res.data.username, role: res.data.role }));
      onLogin({ username: res.data.username, role: res.data.role });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#2F4F2F]/20">
            <Camera size={26} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-wide">Aravinth Photography</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] mt-2">CMS Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-white font-semibold text-sm mb-6 uppercase tracking-widest">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#2F4F2F] to-[#3F6F3F] hover:from-[#3F5F3F] hover:to-[#4F7F4F] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-[#2F4F2F]/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-[10px] mt-6 tracking-wide">
          Protected admin access only
        </p>
      </div>
    </div>
  );
}
