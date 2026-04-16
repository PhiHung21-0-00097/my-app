"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { AuthAPI } from "@/lib/auth/auth.api";

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
    <div className="flex h-screen items-center justify-center">
      <div className="w-[300px] space-y-4">
        <h1 className="text-xl font-bold text-center">Đăng nhập</h1>

        <input
          placeholder="Username"
          className="w-full border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
