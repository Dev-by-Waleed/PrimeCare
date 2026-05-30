"use client";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products-page" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function NavLinks({ className, linkClassName, onClick }) {
  return (
    <ul className={className}>
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link 
            href={link.href} 
            onClick={onClick} 
            className={linkClassName}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}