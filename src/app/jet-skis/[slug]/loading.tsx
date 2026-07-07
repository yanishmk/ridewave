export default function DetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-5 h-[460px] animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="h-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="h-[520px] animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
