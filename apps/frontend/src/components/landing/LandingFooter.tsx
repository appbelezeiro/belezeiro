import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, Instagram, Facebook, Linkedin, ArrowRight } from "lucide-react";
import { TermsModal } from "./TermsModal";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { CookiesModal } from "./CookiesModal";

const footerLinks = {
  produto: [
    { label: "Funcionalidades", href: "#beneficios", isAnchor: true },
    { label: "Planos", href: "#pricing", isAnchor: true },
    { label: "FAQ", href: "#faq", isAnchor: true },
  ],
  empresa: [
    { label: "Sobre nós", href: "/sobre", isAnchor: false },
    { label: "Blog", href: "/blog", isAnchor: false },
    { label: "Contato", href: "/contato", isAnchor: false },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function LandingFooter() {
  const navigate = useNavigate();
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);

  const handleLinkClick = (href: string, isAnchor: boolean) => {
    if (isAnchor && href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <footer className="bg-muted/50 border-t border-border">
        {/* CTA Section */}
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Comece agora mesmo, é grátis. Em poucos minutos sua agenda estará organizada
              e você poderá receber clientes automaticamente.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/onboarding")}
              className="text-base px-8 h-12 gap-2"
            >
              Começar grátis agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Links Section */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">Belezeiro</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-xs">
                A plataforma completa para salões, barbearias e clínicas de estética.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-3">
                {footerLinks.produto.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.isAnchor)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link, index) => (
                  <li key={index}>
                    {link.isAnchor ? (
                      <button
                        onClick={() => handleLinkClick(link.href, link.isAnchor)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCookiesOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2024 Belezeiro. Todos os direitos reservados.</p>
              <p>Feito com ❤️ para profissionais de beleza</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal open={termsOpen} onOpenChange={setTermsOpen} />
      <PrivacyPolicyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <CookiesModal open={cookiesOpen} onOpenChange={setCookiesOpen} />
    </>
  );
}
