import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/posts/new" element={
                <PrivateRoute><PostForm mode="create" /></PrivateRoute>
              } />
              <Route path="/posts/:id/edit" element={
                <PrivateRoute><PostForm mode="edit" /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute><Admin /></PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
