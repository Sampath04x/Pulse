// components/ui/StarRating.jsx
import { useState } from 'react';
import './StarRating.css';

export function StarRating({ value = 0, max = 5, interactive = false, size = 'md', onChange }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered !== null ? hovered : value;

  return (
    <div className={`star-rating star-${size}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < display;
        return (
          <span
            key={i}
            className={`star ${filled ? 'star-filled' : 'star-empty'} ${interactive ? 'star-interactive' : ''}`}
            onMouseEnter={interactive ? () => setHovered(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHovered(null) : undefined}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
