import { useState } from 'react';
import { createReview } from '../services/api';
import StarRating from './StarRating';
import { Send } from 'lucide-react';

export default function ReviewForm({ transactionId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createReview({
        transactionId,
        rating,
        comment
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al enviar calificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Califica este servicio</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu calificación *
          </label>
          <StarRating
            rating={rating}
            size={32}
            interactive={true}
            onRatingChange={setRating}
          />
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            maxLength="500"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            placeholder="Cuéntanos sobre tu experiencia..."
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500 caracteres</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              <Send size={18} />
              Enviar calificación
            </>
          )}
        </button>
      </form>
    </div>
  );
}