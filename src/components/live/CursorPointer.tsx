type CursorPointerProps = {
  color: string;
  name: string;
  className?: string;
};

export function CursorPointer({ color, name, className = "" }: CursorPointerProps) {
  return (
    <div className={`pointer-events-none absolute left-0 top-0 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5.5 3.2 19.2 12.1l-6.3 1.5 2.4 6.7-3.1 1.1-2.5-6.9L5.5 18.8V3.2Z"
          fill={color}
          stroke="#050505"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="ml-4 -mt-1 hidden whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black shadow-lg sm:inline-block"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}
