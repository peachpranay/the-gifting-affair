"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import "./testimonials.css";
import AnimatedCubesBackground from "./testimonialsBg";

const testimonials = [
  {
    id: 1,
    name: "Emraan R.",
    role: "Event Planner",
    location: "Raipur",
    image: "/images/user1.png",
    quote:
      "The GiftBox was the perfect surprise for my friend's birthday. Beautiful packaging and amazing quality! The attention to detail was remarkable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sanya M.",
    role: "Graphic Designer",
    location: "Mumbai",
    image: "/images/user2.png",
    quote:
      "Absolutely loved the customization options! I ordered one for my sister, and she was thrilled. Highly recommend The GiftBox!",
    rating: 5,
  },
  {
    id: 3,
    name: "Arjun P.",
    role: "Software Engineer",
    location: "Bangalore",
    image: "/images/user3.png",
    quote:
      "The quality of the products exceeded my expectations. It's clear that a lot of thought goes into every detail. I’ll definitely be back!",
    rating: 4,
  },
  {
    id: 4,
    name: "Megha K.",
    role: "Content Writer",
    location: "Delhi",
    image: "/images/user4.png",
    quote:
      "I gifted The GiftBox to my parents, and they absolutely loved it. The packaging, the delivery, and the products were all perfect.",
    rating: 5,
  },
  {
    id: 5,
    name: "Ravi T.",
    role: "Entrepreneur",
    location: "Chennai",
    image: "/images/user5.png",
    quote:
      "Ordered one for a corporate event, and everyone was impressed. The attention to detail and presentation is top-notch. Worth every penny!",
    rating: 4,
  },
  {
    id: 6,
    name: "Priya S.",
    role: "Marketing Manager",
    location: "Pune",
    image: "/images/user6.png",
    quote:
      "The experience was amazing from start to finish! The GiftBox team made sure everything was perfect. I’ll be recommending this to everyone.",
    rating: 5,
  },
];

const communityPhotos = [
  { id: 1, src: "/images/customers/family.jpg", alt: "customer review" },
  { id: 2, src: "/images/customers/family2.jpg", alt: "customer review" },
  { id: 3, src: "/images/customers/family3.jpg", alt: "customer review" },
  { id: 4, src: "/images/customers/family4.jpg", alt: "customer review" },
  { id: 5, src: "/images/customers/family5.jpg", alt: "customer review" },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    // <section className="w-full py-8 sm:py-12 relative overflow-hidden bg-orange-200/50">
    // <section
    //   className="w-full py-8 sm:py-12 relative overflow-hidden"
    //   style={{
    //     height: "calc(100vh - 50px)",
    //     backgroundColor: "#f9f9f9",
    //     backgroundImage: `
    //     linear-gradient(45deg, transparent 65%, #f9f9f9 65%),
    //     linear-gradient(-45deg, transparent 65%, #f9f9f9 65%),
    //     linear-gradient(135deg, transparent 65%, #f9f9f9 65%),
    //     linear-gradient(-135deg, transparent 65%, #f9f9f9 65%),
    //     linear-gradient(45deg, #f9f9f9, #FFE9D0 25%, transparent 25%),
    //     linear-gradient(-45deg, #f9f9f9, #FFE9D0 25%, transparent 25%),
    //     linear-gradient(135deg, #f9f9f9, #FFE9D0 25%, transparent 25%),
    //     linear-gradient(-135deg, #f9f9f9, #FFE9D0 25%, transparent 25%),
    //     linear-gradient(45deg, transparent 20%, #f9f9f9 40%, #FFE9D0 60%, transparent 60%),
    //     linear-gradient(-45deg, transparent 20%, #f9f9f9 40%, #FFE9D0 60%, transparent 60%)
    //   `,
    //     backgroundSize: "3em 8em",
    //     backgroundBlendMode: "multiply",
    //   }}
    // >
    // <section className="w-full py-8 sm:py-12 relative bg-gradient-to-b from-bg3 to-bg1 overflow-hidden">
    <section className="w-full py-8 sm:py-12 relative bg-gradient-to-r to-bg3/10 from-bg1/40 overflow-hidden">
      {/* <div className="absolute inset-0 -z-10 opacity-100">
        <AnimatedCubesBackground />
      </div> */}
      {/* <div className="absolute inset-0 bg-scrolling-pattern animate-bg-scroll opacity-75"></div> */}

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl text-headline font-alegreya font-bold mb-2">
            What Our Community Says
          </h2>
          <p className="text-base sm:text-lg font-bold font-mont text-bg4">
            Real stories from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto lg:mr-6">
          {/* Testimonials Section */}
          <div className="relative min-h-[300px] flex items-center justify-center px-2 sm:px-0">
            <div
              className={`transition-opacity duration-500 w-full ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-[#f9f9f9] bg-opacity-90 rounded-lg p-6 sm:p-10 shadow-xl">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <FaStar key={i} className="text-bg2 text-xl mb-2" />
                    )
                  )}
                </div>
                <p className="text-headline font-alegreya font-semibold text-lg sm:text-xl mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="text-center">
                  <p className="font-mont font-bold text-bg4 text-base sm:text-lg">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="font-mont text-bg3 italic font-semibold text-xs sm:text-sm">
                    {testimonials[currentTestimonial].role} •{" "}
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2 absolute bottom-4">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                      setCurrentTestimonial(idx);
                      setIsVisible(true);
                    }, 500);
                  }}
                  className={`w-2 h-2 rounded-full ${
                    currentTestimonial === idx ? "bg-bg2" : "bg-bg1"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Updated Photo Collage Section */}
          <div className="grid grid-cols-[minmax(120px,180px)_minmax(120px,180px)_minmax(120px,180px)] grid-rows-[110px_60px] gap-2 sm:gap-4 relative mx-auto lg:ml-6">
            {/* Large yellow section - top left */}
            <div className="relative row-start-1 col-start-1 col-span-2 row-span-2 h-48 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[0].src}
                alt={communityPhotos[0].alt}
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Pink section - top right */}
            <div className="relative col-span-1 row-span-1 row-start-1 col-start-3 h-48 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[1].src}
                alt={communityPhotos[1].alt}
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Light blue section - bottom left */}
            <div className="relative col-span-1 row-span-1 row-start-3 col-start-1 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[2].src}
                alt={communityPhotos[2].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Green section - bottom right */}
            <div className="relative col-span-1 row-span-1 col-start-2 row-start-3 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[3].src}
                alt={communityPhotos[3].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative col-span-1 row-span-1 col-start-3 row-start-3 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[4].src}
                alt={communityPhotos[4].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-headline/90 hover:bg-headline text-bg1 hover:scale-105 font-mont text-sm sm:text-md font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition-colors duration-300">
            Share Your Story
          </button>
        </div>
      </div>
    </section>
  );
}
