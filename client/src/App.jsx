import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicApi, BASE_URL } from "./api/api";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChooseUs from "./components/WhyChooseUs";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./pages/AdminPanel";

// Landing page (public website)
function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [services, setServices] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  // Fetch live data from public API
  useEffect(() => {
    publicApi.getServices()
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Failed to load services:", err));

    publicApi.getGallery()
      .then((res) => {
        // Map backend fields to match Gallery component expectations
        const mapped = res.data.map((item) => ({
          id: item.id,
          url: item.imageUrl,
          title: item.title,
          category: item.category,
          albumName: item.description || "",
        }));
        setPhotos(mapped);
      })
      .catch((err) => console.error("Failed to load gallery:", err));

    publicApi.getContact()
      .then((res) => {
        if (res.data.length > 0) {
          setContactInfo(res.data[0]);
        }
      })
      .catch((err) => console.error("Failed to load contact:", err));
  }, []);

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

  // Default contact fallback while loading
  const fallbackContact = {
    studioName: "Aravinth Photography",
    phone: "",
    whatsapp: "",
    email: "",
    instagram: "",
    youtube: "",
    address: "",
    addresses: []
  };

  const activeContact = contactInfo || fallbackContact;

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
      <Services services={services} />

      {/* Pinterest-style Gallery showcase */}
      <Gallery photos={photos} />

      {/* Studio Contact details */}
      <Contact contactInfo={activeContact} />

      {/* Studio Footer */}
      <Footer contactInfo={activeContact} />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
