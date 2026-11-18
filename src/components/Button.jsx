import { Link } from 'react-router-dom';
import Magnetic from './Magnetic.jsx';

/**
 * Single source of truth for buttons — always brand green.
 *  - `to`   → router link
 *  - `href` → external anchor
 *  - else   → <button>
 */
export default function Button({
  to,
  href,
  variant = 'solid',
  size = 'md',
  magnetic = false,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'btn',
    size === 'lg' && 'btn-lg',
    size === 'sm' && 'btn-sm',
    variant === 'outline' && 'btn-outline',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  let el;
  if (to) el = <Link to={to} className={cls} {...rest}>{children}</Link>;
  else if (href) el = <a href={href} className={cls} {...rest}>{children}</a>;
  else el = <button type="button" className={cls} {...rest}>{children}</button>;

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
