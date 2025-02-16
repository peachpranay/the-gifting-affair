"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import OfferSlider from "./OfferSlider";
import CartSidebar from "./CartSidebar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Adjust this value based on your navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100); // Small delay to ensure the page has loaded
  };

  const categories = [
    {
      name: "For Him/Her",
      href: "/products#shop-by-categories?category=for-him-her",
      section: "shop-by-categories",
    },
    {
      name: "Chocolate & Cookies",
      href: "/products#shop-by-categories?category=chocolate-cookies",
      section: "shop-by-categories",
    },
    {
      name: "Tea & Coffee",
      href: "/products#shop-by-categories?category=tea-coffee",
      section: "shop-by-categories",
    },
    {
      name: "Wine & Whiskey",
      href: "/products#shop-by-categories?category=wine-whiskey",
      section: "shop-by-categories",
    },
    {
      name: "Fruits",
      href: "/products#shop-by-categories?category=fruits",
      section: "shop-by-categories",
    },
    {
      name: "Beauty",
      href: "/products#shop-by-categories?category=beauty",
      section: "shop-by-categories",
    },
    {
      name: "Baby",
      href: "/products#shop-by-categories?category=baby",
      section: "shop-by-categories",
    },
    {
      name: "Halal",
      href: "/products#shop-by-categories?category=halal",
      section: "shop-by-categories",
    },
    {
      name: "Wellness",
      href: "/products#shop-by-categories?category=wellness",
      section: "shop-by-categories",
    },
    {
      name: "Evergreen",
      href: "/products#shop-by-categories?category=evergreen",
      section: "shop-by-categories",
    },
  ];

  const occasions = [
    {
      name: "Birthday",
      href: "/products#shop-by-occasion?occasion=birthday",
      section: "shop-by-occasion",
    },
    {
      name: "Anniversary",
      href: "/products#shop-by-occasion?occasion=anniversary",
      section: "shop-by-occasion",
    },
    {
      name: "Farewell",
      href: "/products#shop-by-occasion?occasion=farewell",
      section: "shop-by-occasion",
    },
    {
      name: "Congratulations",
      href: "/products#shop-by-occasion?occasion=congratulations",
      section: "shop-by-occasion",
    },
    {
      name: "Housewarming",
      href: "/products#shop-by-occasion?occasion=housewarming",
      section: "shop-by-occasion",
    },
    {
      name: "Graduation",
      href: "/products#shop-by-occasion?occasion=graduation",
      section: "shop-by-occasion",
    },
    {
      name: "Special Day",
      href: "/products#shop-by-occasion?occasion=special-day",
      section: "shop-by-occasion",
    },
    {
      name: "Get Well Soon",
      href: "/products#shop-by-occasion?occasion=get-well-soon",
      section: "shop-by-occasion",
    },
  ];

  const priceRanges = [
    {
      name: "Below $100",
      href: "/products#shop-by-price?price=below100",
      section: "shop-by-price",
    },
    {
      name: "$100 - $150",
      href: "/products#shop-by-price?price=100to150",
      section: "shop-by-price",
    },
    {
      name: "$150 - $200",
      href: "/products#shop-by-price?price=150to200",
      section: "shop-by-price",
    },
    {
      name: "$200 & Above",
      href: "/products#shop-by-price?price=above200",
      section: "shop-by-price",
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          isScrolled ? "shadow-md" : ""
        } bg-[#f9f9f9]`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 font-semibold font-mont">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="font-macondo font-bold text-2xl text-bg3 hover:text-bg4 transition-colors"
            >
              The Gifting Affair
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <div className="flex flex-row gap-8">
                {/* Shop By Category Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                    onMouseEnter={() => setActiveDropdown("category")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>Shop By Category</span>
                    <ChevronDown size={16} />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                      activeDropdown === "category"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setActiveDropdown("category")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={() => scrollToSection(category.section)}
                        className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Shop By Occasion Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                    onMouseEnter={() => setActiveDropdown("occasion")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>Shop By Occasion</span>
                    <ChevronDown size={16} />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                      activeDropdown === "occasion"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setActiveDropdown("occasion")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {occasions.map((occasion) => (
                      <Link
                        key={occasion.name}
                        href={occasion.href}
                        onClick={() => scrollToSection(occasion.section)}
                        className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                      >
                        {occasion.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Shop By Price Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                    onMouseEnter={() => setActiveDropdown("price")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>Shop By Price</span>
                    <ChevronDown size={16} />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                      activeDropdown === "price"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setActiveDropdown("price")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {priceRanges.map((range) => (
                      <Link
                        key={range.name}
                        href={range.href}
                        onClick={() => scrollToSection(range.section)}
                        className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                      >
                        {range.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="hover:text-bg3 transition-colors"
              >
                Contact
              </Link>

              <Link
                href="/profile"
                className="hover:text-bg3 transition-colors"
              >
                <User size={24} />
              </Link>

              <button
                className="hover:text-bg3 transition-colors relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-bg3 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <div className="flex flex-row gap-4">
                {/* <Link
                  href="/profile"
                  className="hover:text-bg3 transition-colors"
                >
                  <User size={24} />
                </Link> */}

                <button
                  className="hover:text-bg3 transition-colors relative"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-bg3 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  {/* Shop By Category */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "category" ? null : "category"
                        )
                      }
                    >
                      <span>Shop By Category</span>
                      {activeDropdown === "category" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "category" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            onClick={() => scrollToSection(category.section)}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shop By Occasion */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "occasion" ? null : "occasion"
                        )
                      }
                    >
                      <span>Shop By Occasion</span>
                      {activeDropdown === "occasion" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "occasion" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {occasions.map((occasion) => (
                          <Link
                            key={occasion.name}
                            href={occasion.href}
                            onClick={() => scrollToSection(occasion.section)}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {occasion.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shop By Price */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "price" ? null : "price"
                        )
                      }
                    >
                      <span>Shop By Price</span>
                      {activeDropdown === "price" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "price" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {priceRanges.map((range) => (
                          <Link
                            key={range.name}
                            href={range.href}
                            onClick={() => scrollToSection(range.section)}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {range.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-center hover:bg-bg2 rounded-md transition-colors border border-bg2"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="mt-14">
        <OfferSlider />
      </div>
    </>
  );
};

export default Navbar;
