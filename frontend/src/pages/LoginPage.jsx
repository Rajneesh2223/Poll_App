// LoginPage.js
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { loginService } from '../services/loginService';
import SpinnerLoader from '../components/Loaders/SpinnerLoader';
import InlineTextError from '../components/Errors/InlineTextError';
import useUserStore from '../store/useStore';
import { toast } from 'react-toastify';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigate();

  let {setUser} = useUserStore()

  const mutation = useMutation(loginService, {
    onSuccess: (data) => {
      setUser(data?.user);
      toast.success(data?.message);
      setEmail('');
      setPassword('');
      navigator('/dashboard');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email.trim() || !password.trim()) {
      return;
    }
    mutation.mutate({ email, password });
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-950 to-slate-950 min-h-screen p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-float-delayed"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Back</span>
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">Sign in to continue to LivePoll</p>
        
        <form className="space-y-5">
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
 
           {/* Error Message */}
           {mutation.isError && <InlineTextError mutation={mutation} />}
 
          {/* Success Message */}
          {mutation.isSuccess && (
            <p className="text-green-400 text-sm font-medium">
              🎉 {mutation.data.message || "Login is successful"}
            </p>
          )}
 
          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-xs text-purple-400 hover:text-purple-300 hover:underline">Forgot password?</a>
          </div>
 
          {/* Submit Button */}
          <div className="pt-2">
            <button 
              onClick={handleLogin}
              type="submit" 
              className="btn glass-btn-primary w-full text-white rounded-xl shadow-lg"
            >
              {mutation.isLoading ? <SpinnerLoader/> : "Sign In"}
            </button>
          </div>
        </form>
 
        {/* Divider */}
        <div className="divider text-gray-500 my-6 text-xs font-semibold">OR CONTINUE WITH</div>
 
        {/* Sign Up Link */}
        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
