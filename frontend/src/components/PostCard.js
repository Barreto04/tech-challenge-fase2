import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const preview = post.conteudo?.length > 150
    ? post.conteudo.substring(0, 150) + '...'
    : post.conteudo;

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-700 transition">
          <Link to={`/posts/${post._id}`}>{post.titulo}</Link>
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        ✍️ {post.autor} · {formatDate(post.createdAt)}
      </p>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{preview}</p>
      <Link
        to={`/posts/${post._id}`}
        className="text-blue-600 text-sm font-medium hover:text-blue-800 transition"
      >
        Ler mais →
      </Link>
    </div>
  );
}
