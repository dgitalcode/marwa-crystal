export default function AdminLoading() {
  return (
    <div className="grid gap-6 animate-pulse">
      <div className="grid gap-3">
        <div className="h-4 w-24 rounded-full bg-muted" />
        <div className="h-10 w-72 max-w-full rounded-2xl bg-muted" />
        <div className="h-4 w-full max-w-xl rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted" />
    </div>
  );
}
