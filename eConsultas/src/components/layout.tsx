import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <a
                href="/"
                className="flex items-center px-2 py-2  text-primary-dark"
              >
                Home
              </a>
              <a
                href="/about"
                className="flex items-center px-2 py-2 text-gray-700"
              >
                About
              </a>
              <a
                href="/paciente"
                className="flex items-center px-2 py-2 text-gray-700"
              >
                paciente
              </a>
              <a
                href="/colorshowcase"
                className="flex items-center px-2 py-2 text-gray-700"
              >
                paleta de colores y botones
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
