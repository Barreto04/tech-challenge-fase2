import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await postService.getAll();
      setPosts(res.data.data);
    } catch {
      setError('Erro ao carregar posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`Deseja excluir o post "${titulo}"?`)) return;
    setDeleting(id);
    try {
      await postService.delete(id);
      setPosts(posts.filter(p => p._id !== id));
    } catch {
      setError('Erro ao excluir post.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} postagem(ns) cadastrada(s)</p>
        </div>
        <Link
          to="/posts/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium text-sm"
        >
          + Nova Postagem
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma postagem encontrada.</p>
          <Link to="/posts/new" className="text-blue-600 hover:underline mt-2 inline-block">
            Criar primeira postagem
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Título</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Autor</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Data</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-gray-800 font-medium hover:text-blue-700 transition text-sm"
                    >
                      {post.titulo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.autor}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/posts/${post._id}/edit`)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post._id, post.titulo)}
                        disabled={deleting === post._id}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-medium hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {deleting === post._id ? '...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
