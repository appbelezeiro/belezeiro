import { Instagram, Facebook, MessageCircle, Globe, Heart } from "lucide-react";

interface PublicFooterProps {
  businessName: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    website?: string;
  };
}

export const PublicFooter = ({ businessName, socialLinks }: PublicFooterProps) => {
  const currentYear = new Date().getFullYear();
  
  const links = [
    { key: "instagram", url: socialLinks.instagram, icon: Instagram },
    { key: "facebook", url: socialLinks.facebook, icon: Facebook },
    { key: "whatsapp", url: socialLinks.whatsapp, icon: MessageCircle },
    { key: "website", url: socialLinks.website, icon: Globe },
  ].filter((link) => link.url);

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-foreground">{businessName}</h4>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Todos os direitos reservados.
            </p>
          </div>

          {/* Social Links */}
          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Powered by */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Feito com <Heart className="h-3 w-3 text-destructive" /> pelo
              <a href="/" className="text-primary hover:underline font-medium">
                Belezeiro
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
