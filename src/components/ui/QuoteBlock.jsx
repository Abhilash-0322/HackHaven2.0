export default function QuoteBlock({ quote, attribution, className = '' }) {
  return (
    <blockquote className={`editorial-quote ${className}`}>
      <p>&ldquo;{quote}&rdquo;</p>
      {attribution && (
        <footer className="mt-4 font-sans text-sm not-italic text-charcoal-muted tracking-wide">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
