"use client";
import { useEffect, useState } from "react";
import { useAuthState, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/Firebase/config";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login() {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [signInWithEmailAndPassword] =
    useSignInWithEmailAndPassword(auth);

  const validateForm = () => {
    setError("");
    if (!email || !password) {
      toast("Both fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result) {
        setEmail("");
        setPassword("");
        if (!result.user.emailVerified) {
          toast.error("Please verify your email before logging in.");
        } else {
          toast.success("Logged in successfully!");
          localStorage.setItem("user", JSON.stringify(true));
          router.push("/");
        }
      }
    } catch (error: unknown) {
      console.error("Login Error: ", error);

      if (error instanceof Error) {
        console.log("Error message:", error.message);
        if (error.message.includes("user-not-found")) {
          toast.error("No user found with this email.");
        } else if (error.message.includes("wrong-password")) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error("Error: " + error.message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  return (

    <div
      className="min-h-screen flex justify-center items-center bg-black object-fit text-white"
    >
      <div className="bg-[rgba(6,156,239,0.41)] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/Register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>

  );
}
