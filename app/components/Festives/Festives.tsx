// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// // import festiveHampers from "/public/data/temporary.json";
// import { BsArrowRight } from "react-icons/bs";
// import "./festives.css";
// import ConfettiBackground from "./ConfettiBackground";
// import AnimatedCubesBackground from "../Testimonials/testimonialsBg";
// import { useEffect, useState } from "react";

// const BackgroundPattern = {
//   height: "calc(100vh - 50px)",
//   "--s": "110px",
//   "--c1": "rgba(236, 208, 120, 1)",
//   "--c2": "rgba(84, 36, 55, 1)",
//   "--l1": "rgba(0, 0, 0, 0) 48%, var(--c1) 0 52%, rgba(0, 0, 0, 0) 0",
//   "--l2": "rgba(0, 0, 0, 0) 1.3%, var(--c2) 0 32%, rgba(0, 0, 0, 0) 0",
//   backgroundImage: `
//     linear-gradient(-45deg, var(--l2)),
//     linear-gradient(45deg, var(--l1)),
//     linear-gradient(45deg, var(--l2)),
//     linear-gradient(-45deg, var(--l1))
//   `,
//   backgroundPosition: `
//     0 0,
//     0 0,
//     calc(var(--s)/2) calc(var(--s)/2),
//     0 0
//   `,
//   backgroundColor: "var(--c2)",
//   backgroundSize: "calc(2*var(--s)) var(--s), var(--s) var(--s)",
// };

// const Festives = () => {
//   const [festiveHampers, setFestiveHampers] = useState([]);

//   useEffect(() => {
//     fetch("/data/temporary.json")
//       .then((response) => response.json())
//       .then((data) => setFestiveHampers(data))
//       .catch((error) => console.error("Error fetching JSON:", error));
//   }, []);
//   return (
//     // <section className="py-8 relative " style={BackgroundPattern}>
//     <section
//       id="special-hampers"
//       className="pt-8 relative bg-gradient-to-r from-bg1/40 to-bg3/10"
//     >
//       {/* <div className="absolute inset-0 z-0 opacity-30">
//         <AnimatedCubesBackground />
//         <ConfettiBackground />
//       </div> */}
//       <div className="container mx-auto px-4 z-10">
//         <h2 className="text-4xl md:text-5xl font-alegreya font-bold text-center mb-2 text-headline">
//           Exclusive Festive Hampers
//         </h2>
//         <p className="text-center text-bg4 font-mont font-semibold text-md mb-6 max-w-2xl mx-auto">
//           Celebrate the season with these specially curated hampers!
//         </p>

//         <Swiper
//           modules={[Autoplay, Navigation, Pagination]}
//           spaceBetween={30}
//           slidesPerView={1}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           navigation
//           pagination={{ clickable: true }}
//           className="festive-swiper"
//           color="white"
//         >
//           {festiveHampers.map((hamper, index) => (
//             <SwiperSlide key={hamper.id}>
//               <div
//                 className={`flex flex-col md:flex-row md:mx-12 md:mt-6 justify-center items-center  ${
//                   index % 2 === 0 ? "" : "md:flex-row-reverse"
//                 } bg-[#f9f9f9] rounded-xl overflow-hidden shadow-lg`}
//               >
//                 <div className="md:w-1/2 px-4 py-4 relative h-64 md:h-96">
//                   <img
//                     src={hamper.image}
//                     alt={hamper.name}
//                     className="w-full h-full object-fill rounded-xl"
//                   />
//                 </div>
//                 <div
//                   className={`md:w-1/2 px-4 py-2 md:px-6 md:py-4 ${
//                     index % 2 === 0 ? "text-left" : "text-left flex flex-col"
//                   }`}
//                 >
//                   <h3 className="text-3xl font-bold mb-2 font-domine text-headline">
//                     {hamper.name}
//                   </h3>
//                   <p className="text-2xl text-primary mb-2 md:mb-4 font-mont text-bg4 font-semibold">
//                     ${hamper.price}
//                   </p>
//                   <ul className="mb-2 md:mb-4 space-y-1 text-sm md:text-md font-semibold text-headline/90">
//                     {hamper.components.slice(0, 100).map((component, i) => (
//                       <li key={i} className="flex items-center">
//                         <span className="mr-2">•</span> {component}
//                       </li>
//                     ))}
//                   </ul>
//                   {hamper.specialFeature && (
//                     <p className="text-md font-bold text-gray-600 mb">
//                       {hamper.specialFeature}
//                     </p>
//                   )}
//                   {hamper.stock && (
//                     <p
//                       className={`text-sm font-bold ${
//                         hamper.stock === "Limited Stock Available"
//                           ? "text-red-500"
//                           : "text-green-500"
//                       }`}
//                     >
//                       {hamper.stock}
//                     </p>
//                   )}
//                   <button className="flex items-center gap-2 bg-primary text-green-600 hover:text-green-700 font-bold px-4 py-0 text-lg rounded-full hover:bg-primary-dark transition-all">
//                     Shop Now <BsArrowRight />
//                   </button>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default Festives;




"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BsArrowRight } from "react-icons/bs";
import "./festives.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

interface FestiveHamper {
  id: string;
  name: string;
  price: number;
  image: string;
  components: string[];
  specialFeature?: string;
  stock?: boolean;
  festive: boolean;
}

const Festives = () => {
  const [festiveHampers, setFestiveHampers] = useState<FestiveHamper[]>([]);

  useEffect(() => {
    const fetchFestiveHampers = async () => {
      try {
        const q = query(
          collection(db, "Products"), 
          where("festive", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const hampers: FestiveHamper[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FestiveHamper));

        setFestiveHampers(hampers);
      } catch (error) {
        console.error("Error fetching festive hampers from Firestore:", error);
      }
    };

    fetchFestiveHampers();
  }, []);

  return (
    <section
      id="special-hampers"
      className="pt-8 relative bg-gradient-to-r from-bg1/40 to-bg3/10"
    >
      <div className="container mx-auto px-4 z-10">
        <h2 className="text-4xl md:text-5xl font-alegreya font-bold text-center mb-2 text-headline">
          Exclusive Festive Hampers
        </h2>
        <p className="text-center text-bg4 font-mont font-semibold text-md mb-6 max-w-2xl mx-auto">
          Celebrate the season with these specially curated hampers!
        </p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation
          pagination={{ clickable: true }}
          className="festive-swiper"
          color="white"
        >
          {festiveHampers.map((hamper, index) => (
            <SwiperSlide key={hamper.id}>
              <div
                className={`flex flex-col md:flex-row md:mx-12 md:mt-6 justify-center items-center  ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                } bg-[#f9f9f9] rounded-xl overflow-hidden shadow-lg`}
              >
                <div className="md:w-1/2 px-4 py-4 relative h-64 md:h-96">
                  <img
                    src={hamper.image}
                    alt={hamper.name}
                    className="w-full h-full object-fill rounded-xl"
                  />
                </div>
                <div
                  className={`md:w-1/2 px-4 py-2 md:px-6 md:py-4 ${
                    index % 2 === 0 ? "text-left" : "text-left flex flex-col"
                  }`}
                >
                  <h3 className="text-3xl font-bold mb-2 font-domine text-headline">
                    {hamper.name}
                  </h3>
                  <p className="text-2xl text-primary mb-2 md:mb-4 font-mont text-bg4 font-semibold">
                    ${hamper.price}
                  </p>
                  <ul className="mb-2 md:mb-4 space-y-1 text-sm md:text-md font-semibold text-headline/90">
                    {hamper.components.slice(0, 100).map((component, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">•</span> {component}
                      </li>
                    ))}
                  </ul>
                  {hamper.specialFeature && (
                    <p className="text-md font-bold text-gray-600 mb">
                      {hamper.specialFeature}
                    </p>
                  )}
                  {hamper.stock && (
                    <p
                      className={`text-sm font-bold ${
                        hamper.stock === "Limited Stock Available"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {hamper.stock}
                    </p>
                  )}
                  <button className="flex items-center gap-2 bg-primary text-green-600 hover:text-green-700 font-bold px-4 py-0 text-lg rounded-full hover:bg-primary-dark transition-all">
                    Shop Now <BsArrowRight />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Festives;