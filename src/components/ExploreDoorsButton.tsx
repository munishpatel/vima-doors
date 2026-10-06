import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/** Primary CTA that sends visitors to the full door catalogue. */
export default function ExploreDoorsButton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <Link to="/products" className={`btn-cta btn-primary ${className}`}>
      Explore Our Doors
      <span className="btn-icon">
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
