import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicApi } from "./api/api";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChooseUs from "./components/WhyChooseUs";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Code splitting for Admin Panel
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function PageLoading() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#2F4F2F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Landing page (public website)
function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [services, setServices] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  // Fetch live data from public API in parallel
  useEffect(() => {
    Promise.allSettled([
      publicApi.getServices(),
      publicApi.getGallery(),
      publicApi.getContact()
    ]).then(([servicesRes, galleryRes, contactRes]) => {
      if (servicesRes.status === "fulfilled") {
        setServices(servicesRes.value.data);
      }
      if (galleryRes.status === "fulfilled") {
        const mapped = galleryRes.value.data.map((item) => ({
          id: item.id,
          url: item.imageUrl,
          title: item.title,
          category: item.category,
          albumName: item.description || "",
        }));
        setPhotos(mapped);
      }
      if (contactRes.status === "fulfilled" && contactRes.value.data.length > 0) {
        setContactInfo(contactRes.value.data[0]);
      }
    });
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
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoading />}>
              <AdminPanel />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
