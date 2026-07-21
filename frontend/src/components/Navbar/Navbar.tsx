import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { Leaf } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Languages", href: "#languages" },
  { label: "About", href: "#about" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">

            <Leaf size={24} />

          </div>

          <div>

            <h1 className="text-xl font-bold text-slate-900">
              KisanBot
            </h1>

            <p className="text-xs text-slate-500">
              AI Farming Assistant
            </p>

          </div>

        </Link>

        {/* Desktop Nav */}

        <nav className="hidden items-center gap-3 rounded-full bg-white p-2 shadow-lg md:flex">

          {navItems.map((item) => (

            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600"
            >
              {item.label}
            </a>

          ))}

        </nav>

        {/* Desktop Buttons */}

        <div className="hidden items-center gap-4 md:flex">

          <Link
            to="/login"
            className="rounded-full border border-emerald-500 px-6 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            Login
          </Link>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-green-700 px-7 py-3 font-semibold text-white shadow-xl"
            >
              Get Started
            </Link>
          </motion.div>

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-2xl bg-white p-3 shadow-lg md:hidden"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: .25 }}
            className="border-t bg-white shadow-xl md:hidden"
          >

            <div className="space-y-3 p-6">

              {navItems.map((item) => (

                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-5 py-4 text-lg font-medium transition hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {item.label}
                </a>

              ))}

              <div className="space-y-3 pt-3">

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl border border-emerald-500 py-3 text-center font-semibold text-emerald-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 py-3 text-center font-semibold text-white"
                >
                  Get Started
                </Link>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </header>
  );
}

export default Navbar;