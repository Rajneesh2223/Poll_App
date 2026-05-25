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
    <div className=" flex justify-center h-screen bg-base-200 p-4">
      <div className="w-full max-w-md  rounded-lg ">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Sign Up
        </h2>

        <form className="space-y-4">
          {/* Username Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-200">Username</span>
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter your username"
              className="input input-bordered w-full bg-gray-700 text-white focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>

          {/* Email Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-200">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input input-bordered w-full bg-gray-700 text-white focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-200">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-700 text-white focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>

          {/* Error Message and Success Message */}
          {mutation.isError && <InlineTextError mutation={mutation} />}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm md:text-base">
              🎉 {mutation.data.message || "Process is successfull"}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              onClick={handleSignup}
              type="submit"
              className="btn btn-primary w-full text-white mt-4"
            >
              {mutation.isLoading ? <SpinnerLoader /> : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider text-gray-400">OR</div>

        {/* Login Link */}
        <p className="text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
