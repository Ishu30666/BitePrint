"use client";
import { useEffect, useState } from "react";
import { useAuthState, useCreateUserWithEmailAndPassword, useSendEmailVerification } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/Firebase/config";
import { collection, setDoc, doc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [CreateUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);

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
      toast(".");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await CreateUserWithEmailAndPassword(email, password);
      if (userCredential) {
        await sendEmailVerification(userCredential.user);
        setEmail("");
        setPassword("");
        toast.success("Account created successfully! Please check your email for verification.", {
          onClose: () => router.push("/Login"), 
        });
      }
    } catch (error) {
      console.log(error);
      if (error.message.includes("email-already-in-use")) {
        toast.error("This email is already in use. Please try another one.");
      } else if (error.message.includes("invalid-email")) {
        toast.error("The email address is invalid. Please check and try again.");
      } else if (error.message.includes("weak-password")) {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <div className="bg-[rgba(6,156,239,0.41)] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/Login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}
