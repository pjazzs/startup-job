
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, BriefcaseBusiness } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BriefcaseBusiness size={22} />
          </span>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            LaunchBoard
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 sm:flex">
          <NavLink to="/" end className={navLinkClass}>
            Find Jobs
          </NavLink>

          <NavLink to="/saved" className={navLinkClass}>
            Saved Jobs
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 sm:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navLinkClass}
            >
              Find Jobs
            </NavLink>

            <NavLink
              to="/saved"
              onClick={closeMenu}
              className={navLinkClass}
            >
              Saved Jobs
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
