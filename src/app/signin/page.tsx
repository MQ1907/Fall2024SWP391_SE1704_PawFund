'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "antd";
import { useAppDispatch, useAppSelector } from '../../lib/hook';
import { signin } from '../../lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = () => {
    console.log('email:', email);
    console.log('password:', password);
    dispatch(signin({ email, password })).then((result) => {
      console.log('Signin result:', result);
      if (result.meta.requestStatus === 'fulfilled') {
        const token = result.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token); 
        }
        router.push('/'); 
      }
    });
  };

  useEffect(() => {
    if (authStatus === 'failed') {
      console.log('Login failed:', error); 
    }
  }, [authStatus, error]);

  return (
    <div className="flex h-screen text-center justify-center align-middle">
      <div className="w-[50%] bg-gray-200">
        <Image
          src="/images/btlogin.png"
          alt="Dog and Cat"
          width={1000}
          height={1000}
          className="w-[100%] h-[100%]"
        />
      </div>
      <div className="w-[50%] text-center w-[100%]">
        <div>
          <h1 className="text-[40px] font-bold pt-[140px]">Sign In</h1>
          {authStatus === 'failed' && <p className="text-red-500">{error}</p>} 
          <div className="w-[50%] ml-[200px] pt-[50px]">
            <Input
              className="h-[40px]"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: "#e5e4e4", border: "none" }}
            />
            <Input
              type="password"
              className="h-[40px]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#e5e4e4", border: "none", marginTop: "30px" }}
            />
            <button onClick={handleSignin} className="text-[15px] mt-6 px-4 py-3 w-[100%] bg-[#2b74d4] text-white font-semibold rounded-md">
              Get Started
            </button>
            <div className="pt-10">
              <p className="text-[15px]">
                Dont have an account?{" "}
                <a className="text-[#FFEB55] cursor-pointer px-2" onClick={() => router.push('/signup')}>Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;