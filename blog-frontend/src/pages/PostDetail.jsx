import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../store/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }
  const currentUserId = token ? parseJwt(token)?.id : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const postData = await apiRequest(`/posts/${id}`);
        setPost(postData);
        const commentsData = await apiRequest(`/comments/${id}`);
        setComments(commentsData);
        const likesData = await apiRequest(`/likes/${id}`);
        setLikeCount(likesData.count);
        setLikeUsers(likesData.users);
        if (token && likesData.users.some(u => u._id === currentUserId)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [id, token]);

  async function handleAddComment(e) {
    e.preventDefault();
    setCommentError('');
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    try {
      await apiRequest(`/comments/${id}`, {
        method: 'POST',
        body: JSON.stringify({ content: commentText }),
      });
      setCommentText('');
      const commentsData = await apiRequest(`/comments/${id}`);
      setComments(commentsData);
    } catch (err) {
      setCommentError(err.message);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await apiRequest(`/comments/delete/${commentId}`, { method: 'DELETE' });
      setComments(comments => comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggleLike() {
    setLikeLoading(true);
    setLikeError('');
    try {
      const res = await apiRequest(`/likes/${id}`, { method: 'POST' });
      setLiked(res.liked);
      const likesData = await apiRequest(`/likes/${id}`);
      setLikeCount(likesData.count);
      setLikeUsers(likesData.users);
    } catch (err) {
      setLikeError(err.message);
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleDeletePost() {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiRequest(`/posts/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post not found.</div>;

  return (
    <div className="w-full max-w-3xl mx-auto mt-14 bg-white rounded-2xl shadow p-12 flex flex-col gap-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-extrabold">{post.title}</h1>
        {post.author?._id === currentUserId && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/create/${post._id}`)}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 font-semibold"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm mb-2">
        by {post.author?.username || 'Unknown'} &middot; {new Date(post.createdAt).toLocaleDateString()}
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="mb-4 rounded-lg max-h-96 object-cover w-full" />
      )}
      <div className="mb-2 whitespace-pre-line text-lg text-gray-800">{post.content}</div>
      <div className="flex gap-6 mb-4 text-gray-400 text-base items-center">
        <button
          onClick={handleToggleLike}
          disabled={!isLoggedIn || likeLoading}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg border ${liked ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-gray-100 border-gray-300'} hover:shadow transition disabled:opacity-50 font-semibold`}
        >
          👍 {likeCount} {liked ? 'Unlike' : 'Like'}
        </button>
        <span>💬 {comments.length} Comments</span>
        {likeError && <span className="text-red-500 ml-2">{likeError}</span>}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {isLoggedIn && (
          <form onSubmit={handleAddComment} className="mb-8 flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              disabled={!commentText.trim()}
            >
              Comment
            </button>
          </form>
        )}
        {commentError && <div className="text-red-500 mb-2">{commentError}</div>}
        {comments.length === 0 ? (
          <div className="text-gray-400">No comments yet.</div>
        ) : (
          <ul className="space-y-4">
            {comments.map(comment => (
              <li key={comment._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-700 mb-1 font-semibold">{comment.author?.username || 'Unknown'}</div>
                  <div className="text-base text-gray-800">{comment.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</div>
                </div>
                {isLoggedIn && comment.author?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="ml-4 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 