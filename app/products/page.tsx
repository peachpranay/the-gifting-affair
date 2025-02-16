"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Ṇavbar/Navbar";
import ShopByCategories from "../components/ShopByCategories/ShopByCategories";
import ShopByOccasion from "../components/ShopByOccasion/ShopByOccasion";
import ShopByPrice from "../components/ShopByPrice/ShopByPrice";
import Footer from "../components/Footer";

const ProductsPage = () => {
  useEffect(() => {
    const targetOccasion = sessionStorage.getItem("targetOccasion");
    if (targetOccasion) {
      setTimeout(() => {
        const element = document.getElementById("shop-by-occasion");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.scrollBy(0, -80); // Offset for navbar
        }
        sessionStorage.removeItem("targetOccasion");
      }, 100);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <ShopByCategories />
      <ShopByOccasion />
      <ShopByPrice />
      <Footer />
    </div>
  );
};

export default ProductsPage;
