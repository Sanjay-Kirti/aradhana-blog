import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../store/AuthContext';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  // Helper to decode JWT and get user id
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }
  const currentUserId = token ? parseJwt(token)?.id : null;

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError('');
      try {
        const data = await apiRequest('/posts');
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function handleDelete(postId) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
      setPosts(posts => posts.filter(p => p._id !== postId));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="text-center mt-10">Loading posts...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="mt-12">
      <h1 className="text-3xl font-extrabold mb-10 text-center">Blog Posts</h1>
      {posts.length === 0 ? (
        <div className="text-gray-400 text-center">No posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-3 transition hover:shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <Link to={`/post/${post._id}`} className="text-xl font-bold text-blue-700 hover:underline">
                  {post.title}
                </Link>
                {post.author?._id === currentUserId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/create/${post._id}`)}
                      className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                by {post.author?.username || 'Unknown'} &middot; {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-6 mt-2 text-gray-400 text-sm">
                <span>👍 {post.likes?.length ?? post.likes ?? 0}</span>
                <span>💬 {post.comments?.length ?? post.comments ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 