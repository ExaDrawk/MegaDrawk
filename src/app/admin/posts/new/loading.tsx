export default function AdminPostNewLoading() {
  return (
    <div className="page-section">
      <div>
        <div className="space-y-5">
          <div className="skeleton h-4 w-40 max-w-full rounded-full" />
          <div className="skeleton h-12 w-72 max-w-full rounded-xl" />
          <div className="skeleton h-24 max-w-[44rem] rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="skeleton h-[28rem] rounded-[var(--radius-xl)]" />
            <div className="skeleton h-[28rem] rounded-[var(--radius-xl)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
