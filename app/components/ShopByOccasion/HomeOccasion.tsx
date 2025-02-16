"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

type Occasion =
  | "Birthday"
  | "Anniversary"
  | "Farewell"
  | "Congratulations"
  | "Housewarming"
  | "Graduation"
  | "Special Day"
  | "Get Well Soon";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  occasion: string[];
}

const HomeOccasion = () => {
  const router = useRouter();
  const [occasionImages, setOccasionImages] = useState<Record<string, string>>(
    {}
  );
  const occasions: Occasion[] = [
    "Birthday",
    "Anniversary",
    "Farewell",
    "Congratulations",
    "Housewarming",
    "Graduation",
    "Special Day",
    "Get Well Soon",
  ];

  useEffect(() => {
    const fetchOccasionImages = async () => {
      const images: Record<string, string> = {};
      const usedImages = new Set<string>();

      for (const occasion of occasions) {
        try {
          const q = query(
            collection(db, "Products"),
            where("occasion", "array-contains", occasion)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const occasionHampers = querySnapshot.docs.map(
              (doc) => doc.data() as Hamper
            );

            let selectedImage = "/images/hampers/hero2.jpg";
            for (const hamper of occasionHampers) {
              if (!usedImages.has(hamper.image)) {
                selectedImage = hamper.image;
                usedImages.add(hamper.image);
                break;
              }
            }

            images[occasion] = selectedImage;
          } else {
            images[occasion] = "/images/hampers/hero2.jpg";
          }
        } catch (error) {
          console.error(`Error fetching image for ${occasion}:`, error);
          images[occasion] = "/images/hampers/hero2.jpg";
        }
      }

      setOccasionImages(images);
    };

    fetchOccasionImages();
  }, []);

  const handleOccasionClick = (occasion: Occasion) => {
    const encodedOccasion = occasion.toLowerCase().replace(/\s+/g, "-");
    router.push(`/products#shop-by-occasion?occasion=${encodedOccasion}`);

    // Add timeout to allow for route change before scrolling
    setTimeout(() => {
      const element = document.getElementById("shop-by-occasion");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      id="shop-by-occasion"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-l from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Occasion
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-8">
          Perfect Gifts for Every Moment
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {occasions.map((occasion) => (
            <div
              key={occasion}
              onClick={() => handleOccasionClick(occasion)}
              className="bg-white border-headline border border-opacity-30 rounded-md shadow-md p-1.5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="aspect-[7/5] rounded-md overflow-hidden mb-1">
                <img
                  src={occasionImages[occasion] || "/images/hampers/hero2.jpg"}
                  alt={occasion}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-center text-lg font-alegreya text-headline font-semibold">
                {occasion}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeOccasion;
