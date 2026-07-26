"use client";

import { motion } from "framer-motion";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 lg:px-16 py-6"
      style={{ backgroundColor: "rgba(240, 238, 228, 0.85)", backdropFilter: "blur(12px)" }}
    >
      {/* Logo / Name */}
      <a href="/" className="flex items-center gap-2 no-underline">
        <span
          className="heading-md text-cyprus"
          style={{ fontSize: "1.25rem" }}
        >
          Ahmed
        </span>
        <span className="dot-accent" style={{ width: 7, height: 7 }} />
      </a>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-10 list-none">
        {navLinks.map((link, i) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + i * 0.1,
              ease: [0.25, 0.8, 0.25, 1],
            }}
          >
            <a href={link.href} className="nav-link">
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.a
        href="#contact"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        className="hidden md:inline-flex items-center gap-2 no-underline px-5 py-2.5 rounded-full text-sand text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{
          backgroundColor: "var(--color-cyprus)",
          fontFamily: "var(--font-body)",
          letterSpacing: "0.05em",
        }}
      >
        Let's Talk
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </motion.a>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
        aria-label="Open menu"
      >
        <span
          className="block w-6 h-[2px]"
          style={{ backgroundColor: "var(--color-cyprus)" }}
        />
        <span
          className="block w-4 h-[2px]"
          style={{ backgroundColor: "var(--color-cyprus)" }}
        />
      </button>
    </motion.nav>
  );
}
