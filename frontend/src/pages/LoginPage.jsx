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
    <div className="flex justify-center bg-base-200 h-screen  p-4">
      <div className="w-full max-w-md  rounded-lg  p-8">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>
        
        <form className="space-y-4">
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

           {/* Error Message */}
           {mutation.isError && <InlineTextError mutation={mutation} />}

          {/* Success Message */}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm md:text-base">
              🎉 {mutation.data.message || "Login is successfull"}
            </p>
          )}

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>

         

          {/* Submit Button */}
          <div>
            <button 
              onClick={handleLogin}
              type="submit" 
              className="btn btn-primary w-full text-white"
            >
              {mutation.isLoading ? <SpinnerLoader/> : "Login"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider text-gray-400">OR</div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-300">
          Don’t have an account?{' '}
          <Link to="/register" href="#" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
