"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { AuthAPI } from "@/lib/auth/auth.api";
import { Landmark, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await AuthAPI.login(username, password);

      setToken(res.access_token);

      toast.success("Đăng nhập thành công");
      router.push("/trang-chu");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] antialiased">
      {/* Background Gradient nhẹ tạo chiều sâu */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0a0a0a] to-[#000000] opacity-50" />

      <div className="relative z-10 w-full max-w-md px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo hoặc Biểu tượng quyền lực */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-4 border border-zinc-800 rounded-full bg-gradient-to-b from-zinc-800 to-black shadow-2xl">
              <Landmark className="w-9 h-9 text-zinc-300" strokeWidth={1} />
            </div>
            <h1 className="text-2xl font-light tracking-[0.3em] text-white uppercase mt-4">
              Restaurant Luxury
            </h1>
            <p className="text-sm tracking-[0.5em] text-zinc-500 uppercase">
              Otis
            </p>
          </div>

          <div className="w-full space-y-6 pt-4">
            {/* Input Username */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">
                Account Identifier
              </label>
              <input
                placeholder="Enter username"
                className="w-full bg-transparent border-b border-zinc-800 p-3 text-sm text-zinc-200 outline-none transition-all focus:border-white placeholder:text-zinc-700 font-light tracking-wide"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">
                Secure Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-zinc-800 p-3 text-sm text-zinc-200 outline-none transition-all focus:border-white placeholder:text-zinc-700 font-light tracking-wide"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button Login */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative w-full overflow-hidden border border-zinc-800 bg-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-black hover:text-white active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Initiate Session"
                )}
              </span>
            </button>
          </div>

          {/* Footer tinh tế */}
          <div className="pt-8">
            <p className="text-[9px] tracking-widest text-zinc-600 uppercase italic">
              Experience the pinnacle of management
            </p>
          </div>
        </div>
      </div>

      {/* Trang trí góc - Họa tiết mờ */}
      <div className="fixed bottom-10 right-10 hidden lg:block">
        <p className="text-[10px] text-zinc-800 tracking-[1em] uppercase rotate-90 origin-right">
          © 2026 Edition
        </p>
      </div>
    </div>
  );
}
