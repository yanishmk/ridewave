export default function ExplorerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
        <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
