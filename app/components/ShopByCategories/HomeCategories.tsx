"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

type Category =
  | "For Him/Her"
  | "Chocolate & Cookies"
  | "Tea & Coffee"
  | "Wine & Whiskey"
  | "Fruits"
  | "Beauty"
  | "Baby"
  | "Halal"
  | "Wellness"
  | "Evergreen";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: bool;
  image: string;
  category: string[];
}

const Ho = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {}
  );
  const categories: Category[] = [
    "For Him/Her",
    "Chocolate & Cookies",
    "Tea & Coffee",
    "Wine & Whiskey",
    "Fruits",
    "Beauty",
    "Baby",
    "Halal",
    "Wellness",
    "Evergreen",
  ];

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images: Record<string, string> = {};
      const usedImages = new Set<string>();

      for (const category of categories) {
        try {
          const q = query(
            collection(db, "Products"),
            where("category", "array-contains", category)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get all hampers for this category
            const categoryHampers = querySnapshot.docs.map(
              (doc) => doc.data() as Hamper
            );

            // Find first non-duplicate image
            let selectedImage = "/images/hampers/hero2.jpg";
            for (const hamper of categoryHampers) {
              if (!usedImages.has(hamper.image)) {
                selectedImage = hamper.image;
                usedImages.add(hamper.image);
                break;
              }
            }

            images[category] = selectedImage;
          } else {
            images[category] = "/images/hampers/hero2.jpg";
          }
        } catch (error) {
          console.error(`Error fetching image for ${category}:`, error);
          images[category] = "/images/hampers/hero2.jpg";
        }
      }

      setCategoryImages(images);
    };

    fetchCategoryImages();
  }, []);

  const handleCategoryClick = (category: Category) => {
    const encodedCategory = encodeURIComponent(category.toLowerCase());
    window.location.href = `/products#shop-by-categories?category=${encodedCategory}`;
  };

  return (
    <section
      id="shop-by-categories"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Categories
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-8">
          Our Categories - Handpicked for You!
        </p>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="bg-white border-headline border border-opacity-30 rounded-md shadow-md p-1.5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              // className="bg-red-900/90 rounded-md shadow-md p-1.5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="aspect-square rounded-md   overflow-hidden mb-1">
                {/* <div className="aspect-square rounded-lg overflow-hidden mb-2"> */}
                <img
                  src={categoryImages[category] || "/images/hampers/hero2.jpg"}
                  alt={category}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-center text-lg font-alegreya text-headline font-semibold">
                {/* <h3 className="text-center text-lg font-alegreya text-[#f9f9f9] font-semibold"> */}
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ho;
