import { useState, useEffect } from 'react';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getAll();
      setPosts(res.data.data);
    } catch {
      setError('Erro ao carregar posts. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchPosts();
    try {
      setLoading(true);
      const res = await postService.search(search);
      setPosts(res.data.data);
    } catch {
      setError('Erro ao buscar posts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Postagens</h1>
        <p className="text-gray-500">Conteúdo educacional para professores e alunos</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar posts por palavra-chave..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Buscar
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); fetchPosts(); }}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Limpar
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum post encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
