import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 20, interactive = false, onRatingChange }) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => handleClick(star)}
        />
      ))}
      {!interactive && rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}