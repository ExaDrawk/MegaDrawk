export default function Loading() {
  return (
    <div className="status-page">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4">
        <div className="skeleton h-8 w-48 rounded-md" />
        <div className="skeleton h-5 w-72 max-w-full rounded-md" />
        <div className="skeleton mt-4 h-20 w-full max-w-lg rounded-lg" />
        <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-36 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
