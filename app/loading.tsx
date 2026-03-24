export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
