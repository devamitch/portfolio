"use client";

import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { resumeData } from "~/data/resumeData";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    gsap.fromTo(
      q(".contact-title, .contact-banner, .contact-info, .contact-form"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom-=100",
          end: "center center",
          scrub: true,
        },
      },
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the email using a backend service
    // For demonstration, we'll just log the email content
    console.log("Email content:", renderEmail(formData));
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  const renderEmail = ({ name, email, message }) => (
    <Html>
      <Text>
        New message from {name} ({email})
      </Text>
      <Text>Message: {message}</Text>
      <Button href={`mailto:${email}`}>Reply to {name}</Button>
    </Html>
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 bg-blend-darken backdrop-blur-3xl"
    >
      <div className="container mx-auto px-4">
        <motion.h2 className="contact-title mb-12 text-center text-4xl font-bold text-white">
          Get in Touch
        </motion.h2>
        <div className="contact-banner mb-12 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center text-white shadow-lg">
          <h3 className="mb-4 text-2xl font-bold">
            Let's Build Something Amazing Together!
          </h3>
          <p className="text-lg">
            I'm always open to new opportunities and exciting projects. Feel
            free to reach out!
          </p>
        </div>
        <div className="contact-info mb-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <PhoneIcon className="mx-auto mb-4 h-10 w-10 text-purple-500" />
            <h3 className="mb-2 text-xl font-semibold text-white">Phone</h3>
            <p className="text-gray-300">{resumeData.personalInfo.phone}</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <MailIcon className="mx-auto mb-4 h-10 w-10 text-purple-500" />
            <h3 className="mb-2 text-xl font-semibold text-white">Email</h3>
            <a
              href={`mailto:${resumeData.personalInfo.email}`}
              className="text-gray-300 transition-colors hover:text-purple-400"
            >
              {resumeData.personalInfo.email}
            </a>
          </div>
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <MapPinIcon className="mx-auto mb-4 h-10 w-10 text-purple-500" />
            <h3 className="mb-2 text-xl font-semibold text-white">Location</h3>
            <p className="text-gray-300">{resumeData.personalInfo.location}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
