import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostForm({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: '', conteudo: '', autor: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id) {
      postService.getById(id)
        .then(res => {
          const { titulo, conteudo, autor } = res.data.data;
          setForm({ titulo, conteudo, autor });
        })
        .catch(() => setError('Erro ao carregar post.'))
        .finally(() => setFetching(false));
    }
  }, [id, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.conteudo || !form.autor) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'edit') {
        await postService.update(id, form);
      } else {
        await postService.create(form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar post.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {mode === 'edit' ? '✏️ Editar Postagem' : '📝 Nova Postagem'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título da postagem"
            maxLength={150}
          />
          <span className="text-xs text-gray-400">{form.titulo.length}/150</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
          <input
            type="text"
            value={form.autor}
            onChange={(e) => setForm({ ...form, autor: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do professor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo *</label>
          <textarea
            value={form.conteudo}
            onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={10}
            placeholder="Digite o conteúdo da postagem..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Salvando...' : mode === 'edit' ? 'Salvar Alterações' : 'Publicar Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
