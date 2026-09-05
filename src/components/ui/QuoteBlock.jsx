export default function QuoteBlock({ children, className = '' }) {
  return <blockquote className={`editorial-quote ${className}`}>{children}</blockquote>;
}
