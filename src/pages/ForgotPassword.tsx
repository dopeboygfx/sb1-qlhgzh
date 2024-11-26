import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password reset logic here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="flex justify-center">
              <Database className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-white">Check your email</h2>
            <p className="mt-2 text-gray-400">
              We've sent password reset instructions to {email}
            </p>
          </div>
          <div className="mt-4">
            <Link
              to="/signin"
              className="flex items-center justify-center text-sm text-primary-500 hover:text-primary-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Database className="h-12 w-12 text-primary-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-dark-700 placeholder-gray-500 text-white bg-dark-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Send reset instructions
            </button>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to="/signin"
              className="text-sm text-primary-500 hover:text-primary-400"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}