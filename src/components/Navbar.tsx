export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black text-[#f5f5f5]">
      <a
        href="/"
        className="text-2xl text-yellow-400 w-full flex items-center justify-around"
        onClick={() => {
          localStorage.setItem("category", "home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <span>A</span>
        <span>N</span>
        <span>I</span>
        <span>M</span>
        <span>E</span>
        <span>V</span>
        <span>E</span>
        <span>R</span>
        <span>S</span>
        <span>E</span>
      </a>
    </div>
  );
}
