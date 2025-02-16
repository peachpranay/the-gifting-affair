"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Gift,
} from "lucide-react";

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // newsletter subscription logic
  };

  return (
    // <footer className="bg-gradient-to-b overflow-clip from-bg4/30 to-bg1 text-gray-700 w-full relative">
    <footer className="bg-gradient-to-b overflow-clip from-bg3/40 to-white text-gray-700 w-full relative">
      {/* Footer Images */}
      <div className="absolute -bottom-5 -left-4 w-60 h-36 z-20 drop-shadow-lg opacity-85">
        <Image
          src="/images/hampers/footer1.png"
          alt="Footer decoration 1"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute -bottom-2 -right-4 w-72 h-44 z-20 drop-shadow-lg opacity-85">
        <Image
          src="/images/hampers/footer2.png"
          alt="Footer decoration 2"
          fill
          className="object-contain"
        />
      </div>

      {/* Main Content with higher z-index */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-semibold">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="font-macondo font-bold text-3xl text-bg3">
              The Gifting Affair
            </Link>
            <p className="text-sm mt-2 font-mont font-semibold text-bg4">
              Unwrapping Joy, One Gift at a Time!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:border-bg3 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-bg3 text-white px-4 py-2 rounded-md hover:bg-bg4 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-5 text-xl text-headline">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Shop", href: "/shop" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm hover:text-bg3 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-5 text-headline">
              Get in Touch
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:support@thegiftingaffair.com"
                className="flex items-center gap-2 text-sm hover:text-bg3 transition-colors"
              >
                <Mail size={16} />
                support@thegiftingaffair.com
              </a>
              <a
                href="tel:+11234567890"
                className="flex items-center gap-2 text-sm hover:text-bg3 transition-colors"
              >
                <Phone size={16} />
                +91 99999 99999
              </a>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="font-semibold text-headline">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Linkedin, href: "#" },
                ].map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bg3 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg4/50 mt-12 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} The Gifting Affair. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
