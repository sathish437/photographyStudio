import React, { useState } from "react";
import { Camera, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2F4F2F]/30">
            <Camera size={26} className="text-white" />
          </div>
          <h1 className="text-white font-serif text-2xl font-normal tracking-wide">Aravinth Photography</h1>
          <p className="text-neutral-500 text-[10px] font-sans uppercase tracking-[0.3em] font-semibold mt-1">
            CMS Admin Control Panel
          </p>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-white font-serif text-lg font-normal tracking-wide">Sign In</h2>
            <Lock size={16} className="text-[#7A9E3A]" />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-sans font-medium leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#2F4F2F] to-[#3F6F3F] hover:from-[#3F5F3F] hover:to-[#4F7F4F] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#2F4F2F]/20 active:scale-98 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In to CMS"}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-[10px] font-sans uppercase tracking-widest mt-6">
          Protected Administrative Portal
        </p>
      </div>
    </div>
  );
}
