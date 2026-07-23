// components/ui/Button.jsx
import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  style,
  title,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      title={title}
    >
      {loading
        ? <span className="btn-spinner" />
        : <>
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
            {iconRight && <span className="btn-icon-right">{iconRight}</span>}
          </>
      }
    </button>
  );
}
