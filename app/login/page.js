"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // Don't automatically redirect
    });

    setLoading(false);

    // Handle errors
    if (res?.error) {
      setError("Invalid Credentials");
      return;
    }

    // If login is successful, redirect to dashboard
    if (res?.ok) {
      router.push('/dashboard'); // Correct method to redirect
    }
  };

  return (
    <div className="relative bg-black w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
        <button className="border-2 border-green-400 hover:scale-110 my-2 p-1 rounded-md duration-500" onClick={()=> {
          router.push("/")
        }}>Back to Home</button>
        <form className="space-y-4" method='POST' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email" 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password" 
            />
          </div>

          <div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>

        {/* <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div> */}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;