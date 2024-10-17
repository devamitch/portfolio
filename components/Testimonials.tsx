"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Amit Sharma",
    project: "Be4You Dating App",
    image:
      "https://img.freepik.com/free-psd/3d-illustration-bald-person-with-glasses_23-2149436184.jpg",
    content:
      "Amit's work on our dating app, Be4You, was exceptional. His expertise in React Native and custom animations significantly enhanced our user experience. The implementation of features like social login, Apple login, and Zoom-like video calls was seamless.",
  },
  {
    name: "Sundarban Development Authority",
    project: "Sundarban Development Website",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiqA8iK0iMKaX7N68ig6U5oHbgMhDshRdSOw&s",
    content:
      "We collaborated with Amit through Techpromind for our website project. His attention to detail and ability to create a user-friendly interface greatly improved our online presence. The website perfectly showcases the beauty and importance of the Sundarban region.",
  },
  {
    name: "Mobile Shop Owner",
    project: "E-commerce Website",
    image:
      "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1727136000&semt=ais_hybrid",
    content:
      "Amit developed a super responsive e-commerce website for our mobile shop. The UI is sleek, and the selling process is smooth. Our online sales have significantly increased thanks to his work. We're extremely satisfied with the results.",
  },
];

const Testimonials = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".testimonials-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".testimonials-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="testimonials-title mb-12 text-center text-4xl font-bold text-white">
          Client Testimonials
        </motion.h2>
        <Swiper
          effect={"coverflow"}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          loop
          modules={[EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="w-[300px] sm:w-[350px]">
              <div className="flex h-full flex-col justify-between rounded-lg bg-white bg-opacity-10 p-6 shadow-xl backdrop-blur-lg backdrop-filter">
                <div>
                  <div className="mb-4 flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-purple-500"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-purple-400">{testimonial.project}</p>
                    </div>
                  </div>
                  <p className="mb-4 italic text-gray-300">
                    "{testimonial.content}"
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl text-purple-500">"</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
