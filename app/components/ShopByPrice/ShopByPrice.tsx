"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

type PriceRange = "below100" | "100to150" | "150to200" | "above200";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
}

const ShopByPrice = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange>("below100");

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  const priceRanges = [
    { id: "below100", label: "Below $100" },
    { id: "100to150", label: "$100 - $150" },
    { id: "150to200", label: "$150 - $200" },
    { id: "above200", label: "$200 & Above" },
  ];

  useEffect(() => {
    // Read price range from URL on component mount
    const searchParams = new URLSearchParams(
      window.location.hash.split("?")[1]
    );
    const priceParam = searchParams.get("price");
    if (priceParam) {
      const validRange = priceRanges.find((range) => range.id === priceParam);
      if (validRange) {
        setSelectedPriceRange(validRange.id as PriceRange);
      }
    }
  }, []);

  // Update URL when price range changes and scroll to section
  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRange(range);
    const baseUrl = window.location.pathname + "#shop-by-price";
    const newUrl = `${baseUrl}?price=${range}`;
    window.history.pushState({}, "", newUrl);

    // Add smooth scrolling to the section
    const section = document.getElementById("shop-by-price");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        let q;
        switch (selectedPriceRange) {
          case "below100":
            q = query(collection(db, "Products"), where("price", "<", 100));
            break;
          case "100to150":
            q = query(
              collection(db, "Products"),

              where("price", ">=", 100),
              where("price", "<", 150)
            );
            break;
          case "150to200":
            q = query(
              collection(db, "Products"),

              where("price", ">=", 150),
              where("price", "<", 200)
            );
            break;
          case "above200":
            q = query(collection(db, "Products"), where("price", ">=", 200));
            break;
          default:
            q = query(collection(db, "Products"));
        }

        const querySnapshot = await getDocs(q);
        const hampers: Hamper[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Hamper)
        );

        setHampersData(hampers);
      } catch (error) {
        console.error("Error fetching hampers from Firestore:", error);
      }
    };

    fetchHampers();
  }, [selectedPriceRange]);

  const filteredHampers = hampersData.slice(0, 100);

  return (
    <section
      id="shop-by-price"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Price Range
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-4">
          Find the Perfect Gift Within Your Budget
        </p>

        {/* Price Range Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 mt-4">
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handlePriceRangeChange(range.id as PriceRange)}
              className={`px-4 py-2 rounded-full text-md transition-all font-alegreya font-semibold ${
                selectedPriceRange === range.id
                  ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Hamper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mt-4 hover:cursor-pointer">
          <AnimatePresence mode="wait">
            {filteredHampers.map((hamper) => (
              <motion.div
                key={hamper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(hamper.id)}
                className="bg-red-900/90 hover:bg-red-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={hamper.image}
                    alt={hamper.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                  />
                </div>
                <div className="p-3 flex flex-row text-[#f9f9f9]">
                  <h3 className="text-xl font-alegreya font-semibold">
                    {hamper.name}
                  </h3>
                  <div className="flex items-center ml-auto">
                    <span className="text-xl font-semibold text-[#f9f9f9]">
                      ${hamper.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ShopByPrice;
