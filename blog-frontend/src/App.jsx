import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import CreateEditPost from './pages/CreateEditPost';
import { AuthProvider } from './store/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="min-h-screen bg-gray-50 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<PostsList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreateEditPost />} />
              <Route path="/create/:id" element={<CreateEditPost />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
