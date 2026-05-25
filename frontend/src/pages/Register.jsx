import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import signupUserService from "../services/signupUserService";
import InlineTextError from "../components/Errors/InlineTextError";
import SpinnerLoader from "../components/Loaders/SpinnerLoader";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation(signupUserService, {
    onSuccess: (data) => {
      console.log(data);
      toast.success(data?.message || "Registration successful! Please login.");
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  

  function handleSignup(e) {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate({
      username,
      email,
      password,
    });
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none animate-float-delayed"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Account</span>
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">Join LivePoll to start hosting live polls</p>

        <form className="space-y-5">
          {/* Username Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-gray-300 font-medium text-xs">USERNAME</span>
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="johndoe"
              className="input input-bordered w-full glass-input text-white text-sm"
              required
            />
          </div>

          {/* Email Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-gray-300 font-medium text-xs">EMAIL ADDRESS</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input input-bordered w-full glass-input text-white text-sm"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-gray-300 font-medium text-xs">PASSWORD</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full glass-input text-white text-sm"
              required
            />
          </div>

          {/* Error Message and Success Message */}
          {mutation.isError && <InlineTextError mutation={mutation} />}
          {mutation.isSuccess && (
            <p className="text-green-400 text-sm font-medium">
              🎉 {mutation.data.message || "Process is successful"}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSignup}
              type="submit"
              className="btn glass-btn-primary w-full text-white rounded-xl shadow-lg"
            >
              {mutation.isLoading ? <SpinnerLoader /> : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider text-gray-500 my-6 text-xs font-semibold">OR CONTINUE WITH</div>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
