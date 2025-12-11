import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicAbout } from "@/components/public/PublicAbout";
import { PublicSpecialties } from "@/components/public/PublicSpecialties";
import { PublicServices } from "@/components/public/PublicServices";
import { PublicHours } from "@/components/public/PublicHours";
import { PublicMap } from "@/components/public/PublicMap";
import { PublicSocial } from "@/components/public/PublicSocial";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicOffline } from "@/components/public/PublicOffline";
import { PublicWatermark } from "@/components/public/PublicWatermark";
import { PublicAdSpace } from "@/components/public/PublicAdSpace";
import { useApp } from "@/contexts/AppContext";

// Mock data - would come from API/context based on business settings
const mockUnitData = {
  isEnabled: true,
  isBookingEnabled: true,
  businessName: "Belezeiro",
  title: "Studio Julia Alves — Estética Avançada",
  description: "Especialistas em estética facial e corporal, com atendimento humanizado e resultados naturais. Há mais de 10 anos transformando vidas através do cuidado pessoal.",
  // Gallery images from "Meu Negócio"
  galleryImages: [
    { 
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
      title: "Ambiente Aconchegante",
      description: "Espaço pensado para seu conforto"
    },
    { 
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80",
      title: "Tratamentos Faciais",
      description: "Tecnologia de ponta para sua pele"
    },
    { 
      url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1920&q=80",
      title: "Equipe Especializada",
      description: "Profissionais qualificados e atenciosos"
    },
    { 
      url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80",
      title: "Resultados Naturais",
      description: "Beleza que realça sua essência"
    },
  ],
  // Logo from "Meu Negócio"
  logo: null,
  primaryColor: "hsl(195, 70%, 45%)",
  address: {
    street: "Av. Paulista",
    number: "1000",
    complement: "Sala 101",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    cep: "01310-100",
  },
  phone: "(11) 99999-9999",
  whatsapp: "5511999999999",
  specialties: [
    { id: "esteticista", name: "Estética Facial", icon: "✨" },
    { id: "massagista", name: "Massoterapia", icon: "💆" },
    { id: "depilador", name: "Depilação", icon: "🌸" },
    { id: "sobrancelha", name: "Design de Sobrancelhas", icon: "👁️" },
  ],
  services: [
    { id: "1", name: "Limpeza de Pele", category: "Estética Facial", price: 150, duration: 60, description: "Limpeza profunda com extração e hidratação" },
    { id: "2", name: "Peeling", category: "Estética Facial", price: 200, duration: 45, description: "Renovação celular para pele radiante" },
    { id: "3", name: "Massagem Relaxante", category: "Massoterapia", price: 120, duration: 60, description: "Massagem corporal completa" },
    { id: "4", name: "Drenagem Linfática", category: "Massoterapia", price: 140, duration: 50, description: "Elimina toxinas e reduz inchaço" },
    { id: "5", name: "Depilação a Laser", category: "Depilação", price: 180, duration: 30, description: "Depilação definitiva com laser" },
    { id: "6", name: "Design de Sobrancelha", category: "Design de Sobrancelhas", price: 45, duration: 30, description: "Design personalizado" },
    { id: "7", name: "Micropigmentação", category: "Design de Sobrancelhas", price: 350, duration: 120, description: "Sobrancelhas perfeitas por anos" },
  ],
  amenities: ["wifi", "parking", "coffee", "ac", "waiting-room"],
  hours: {
    monday: { isOpen: true, start: "09:00", end: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
    tuesday: { isOpen: true, start: "09:00", end: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
    wednesday: { isOpen: true, start: "09:00", end: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
    thursday: { isOpen: true, start: "09:00", end: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
    friday: { isOpen: true, start: "09:00", end: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
    saturday: { isOpen: true, start: "09:00", end: "17:00", lunchStart: null, lunchEnd: null },
    sunday: { isOpen: false, start: null, end: null, lunchStart: null, lunchEnd: null },
  },
  socialLinks: {
    instagram: "https://instagram.com/studiojuliaalves",
    facebook: "https://facebook.com/studiojuliaalves",
    whatsapp: "https://wa.me/5511999999999",
    website: "",
  },
  about: "Somos um studio especializado em estética e bem-estar, oferecendo tratamentos personalizados com profissionais qualificados. Nossa missão é proporcionar momentos de cuidado e relaxamento, sempre com foco em resultados naturais e duradouros."
};

const PublicUnit = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { plan, publicDarkMode } = useApp();
  const isFree = plan === "free";
  
  // Using mock data (slug routing disabled for now)
  const unitData = mockUnitData;

  // Apply dark mode class to document
  useEffect(() => {
    if (publicDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [publicDarkMode]);

  if (!unitData.isEnabled) {
    return <PublicOffline businessName={unitData.businessName} />;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner - Free only */}
      {isFree && <PublicWatermark variant="banner" />}
      
      <PublicHeader
        businessName={unitData.businessName}
        logo={unitData.logo}
        primaryColor={unitData.primaryColor}
        isBookingEnabled={unitData.isBookingEnabled}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />
      
      <main>
        <section id="home">
          <PublicHero
            title={unitData.title}
            description={unitData.description}
            logo={unitData.logo}
            galleryImages={unitData.galleryImages}
            specialties={unitData.specialties}
            address={unitData.address}
            phone={unitData.phone}
            primaryColor={unitData.primaryColor}
            isBookingEnabled={unitData.isBookingEnabled}
          />
        </section>

        <section id="about">
          <PublicAbout
            about={unitData.about}
            amenities={unitData.amenities}
          />
        </section>

        {/* Ad Space - Free only */}
        {isFree && (
          <div className="max-w-6xl mx-auto px-4">
            <PublicAdSpace size="medium" />
          </div>
        )}

        <section id="specialties">
          <PublicSpecialties
            specialties={unitData.specialties}
            primaryColor={unitData.primaryColor}
          />
        </section>

        {/* Inline CTA - Free only */}
        {isFree && (
          <div className="max-w-6xl mx-auto px-4">
            <PublicWatermark variant="inline" />
          </div>
        )}

        <section id="services">
          <PublicServices
            services={unitData.services}
            specialties={unitData.specialties}
            primaryColor={unitData.primaryColor}
            isBookingEnabled={unitData.isBookingEnabled}
          />
        </section>

        {/* Ad Space - Free only */}
        {isFree && (
          <div className="max-w-6xl mx-auto px-4">
            <PublicAdSpace size="small" />
          </div>
        )}

        <section id="hours">
          <PublicHours hours={unitData.hours} />
        </section>

        <section id="location">
          <PublicMap
            address={unitData.address}
            businessName={unitData.businessName}
          />
        </section>

        <PublicSocial socialLinks={unitData.socialLinks} />
      </main>

      {/* Footer watermark - Free only */}
      {isFree && <PublicWatermark variant="footer" />}

      <PublicFooter
        businessName={unitData.businessName}
        socialLinks={unitData.socialLinks}
      />

      {/* Floating CTA - Free only */}
      {isFree && <PublicWatermark variant="floating" />}
    </div>
  );
};

export default PublicUnit;
