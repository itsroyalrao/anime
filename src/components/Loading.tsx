export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center cursor-wait">
      <div className="animate-spin border-yellow-400 border-solid w-8 h-8 rounded-full border-y-2"></div>
    </div>
  );
}
