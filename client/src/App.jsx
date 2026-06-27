import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChooseUs from "./components/WhyChooseUs";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import {
  photos,
  contactInfo
} from "./data/mockData";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  // IntersectionObserver to detect active viewport section
  useEffect(() => {
    const sections = ["hero", "about", "why-us", "services", "gallery", "contact"];
    const sectionElements = sections.map((id) => document.getElementById(id)).filter(Boolean);

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.05
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#F7F8F5] min-h-screen text-[#1F1F1F]">
      
      {/* Sticky top Navigation bar */}
      <Navbar activeSection={activeSection} />

      {/* Hero Welcome Slide */}
      <Hero />

      {/* About the Photographer Section */}
      <About />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Premium Services Section */}
      <Services />

      {/* Pinterest-style Gallery showcase */}
      <Gallery photos={photos} />

      {/* Studio Contact details */}
      <Contact contactInfo={contactInfo} />

      {/* Studio Footer */}
      <Footer contactInfo={contactInfo} />

    </div>
  );
}
