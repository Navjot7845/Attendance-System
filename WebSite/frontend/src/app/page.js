"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

function OtpButton({ sendOtp, loading }) {
  return (
    <button
      type="button"
      onClick={sendOtp}
      disabled={loading}
      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {loading ? "Sending OTP..." : "Send OTP"}
    </button>
  );
}

function LoginButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  );
}

function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setError(true);
      setMessage("Invalid email format");
    } else {
      setError(false);
      setMessage("");
    }
  };

  async function sendOtp(e) {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter an email first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Logged in successfully");
        setError(false);
        setShowOtp(true);
      } else {
        setError(true);
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setError(true);
      console.error("Error:", error);
      setMessage("An error occurred while sending OTP.");
    }
    setLoading(false);
  }

  async function forgotPassword(e) {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter an email first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password Reset email sent");
        setError(false);
      } else {
        setError(true);
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setError(true);
      console.error("Error:", error);
      setMessage("An error occurred while sending OTP.");
    }
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError(false);

        // * Go to the dashboard on login.
        router.push("/admin/dashboard");
      } else {
        setError(true);
        setMessage(data.error || "Failed to login");
      }
    } catch (error) {
      setError(true);
      console.error("Error:", error);
      setMessage("An error occurred while logging in.");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md mx-5 p-8 space-y-6 bg-black text-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        <form onSubmit={(showOtp) ? handleLogin : sendOtp} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-400">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              disabled={showOtp}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none text-gray-400 focus:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!showOtp ? (
            <OtpButton sendOtp={sendOtp} loading={loading} />
          ) : (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none text-gray-400 focus:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">
                  OTP:
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the otp"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none text-gray-400 focus:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <LoginButton loading={loading} />
            </>
          )}
          <Button
            onClick={forgotPassword}
          >
            Forgot password
          </Button>
          {message && (
            <p
              className={`text-sm ${error ? "text-red-500" : "text-green-500"}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;