import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../store/AuthContext';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      login(res.token);
      setSuccess('Registration successful!');
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow p-10">
      <h2 className="text-3xl font-extrabold mb-10">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="block mb-2 text-lg">Username</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Enter your username"
            {...register('username')}
            autoComplete="username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-lg">Email</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Enter your email"
            {...register('email')}
            autoComplete="email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-lg">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Enter your password"
            {...register('password')}
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
} 