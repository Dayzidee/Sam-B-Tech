import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-24 px-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-3xl md:text-4xl mb-2">Welcome Back</h1>
          <p className="text-secondary text-sm">Sign in to manage your orders, track repairs, and access exclusive deals.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <Input 
                type="email" 
                placeholder="you@example.com" 
                className="pl-12 h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary">Password</label>
              <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-12 pr-12 h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-primary"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
