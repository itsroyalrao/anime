'use client'
import Navbar from "./Navbar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] pb-20 flex flex-col bg-black text-[#f5f5f5] bg-opacity-50 overflow-auto">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
