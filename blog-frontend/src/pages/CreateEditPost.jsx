import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../store/AuthContext';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export default function CreateEditPost() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // If editing, id will be present
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', imageUrl: '' },
  });

  // If editing, fetch post data
  useEffect(() => {
    if (id) {
      setLoading(true);
      apiRequest(`/posts/${id}`)
        .then(post => {
          setValue('title', post.title);
          setValue('content', post.content);
          setValue('imageUrl', post.imageUrl || '');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    try {
      if (id) {
        // Edit
        await apiRequest(`/posts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        setSuccess('Post updated!');
      } else {
        // Create
        await apiRequest('/posts', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        setSuccess('Post created!');
      }
      reset();
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return <div className="text-center mt-10 text-red-600">You must be logged in to create or edit a post.</div>;
  }
  if (loading) {
    return <div className="text-center mt-10">Loading post...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow p-12">
      <h2 className="text-3xl font-extrabold mb-10">{id ? 'Edit Post' : 'Create a New Post'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="block mb-2 text-lg">Title</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Enter the title of your post"
            {...register('title')}
            autoComplete="off"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-lg">Content</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[120px] placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Write your blog post here"
            {...register('content')}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-lg">Image URL (optional)</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Paste an image URL (optional)"
            {...register('imageUrl')}
            autoComplete="off"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
} 