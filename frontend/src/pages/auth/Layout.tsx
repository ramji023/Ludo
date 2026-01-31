import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/*background image*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/ludo-bg/ludo-bg (3).jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* ludo logo  */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <img
            src="/ludo-bg/ludo_logo.png"
            alt="Ludo Master Logo"
            className="w-25 h-25 object-contain"
          />
        </div>
        {/* render children component  */}
        <Outlet />
      </div>
    </>
  );
}
