export default function Loading() {
  return (
    <div className="status-page">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div
          className="w-48 h-8 rounded-md"
          style={{ background: "var(--color-bg-muted)" }}
        />
        <div
          className="w-72 h-5 rounded-md"
          style={{ background: "var(--color-bg-muted)" }}
        />
        <div
          className="w-full max-w-lg h-20 mt-4 rounded-lg"
          style={{ background: "var(--color-bg-muted)" }}
        />
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-lg"
              style={{ background: "var(--color-bg-muted)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
