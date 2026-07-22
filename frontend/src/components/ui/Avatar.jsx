// components/ui/Avatar.jsx
import './Avatar.css';

const colors = [
  '#2F7D5A','#4CAF7D','#2D7DA0','#9B59B6','#E67E22','#E74C3C','#1ABC9C',
];

function colorFromName(name = '') {
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function Avatar({ name = '', size = 'md', src }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bg = colorFromName(name);
  const sz = { sm: 28, md: 36, lg: 48, xl: 64 }[size] || 36;

  return (
    <div
      className="avatar"
      style={{ width: sz, height: sz, fontSize: sz * 0.36, background: src ? 'transparent' : bg }}
    >
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span>{initials}</span>
      }
    </div>
  );
}
