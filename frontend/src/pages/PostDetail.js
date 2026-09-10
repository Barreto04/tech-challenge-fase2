import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postService.getById(id);
        setPost(res.data.data);
      } catch {
        setError('Post não encontrado.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">← Voltar</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">
        ← Voltar para a lista
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{post.titulo}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span>✍️ {post.autor}</span>
          <span>📅 {formatDate(post.createdAt)}</span>
          {post.updatedAt !== post.createdAt && (
            <span className="text-xs">· Editado em {formatDate(post.updatedAt)}</span>
          )}
        </div>

        <div className="prose text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.conteudo}
        </div>

        {isAuthenticated && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate(`/posts/${id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              ✏️ Editar
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
