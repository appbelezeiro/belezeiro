import { Instagram, Facebook, MessageCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicSocialProps {
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    website?: string;
  };
}

export const PublicSocial = ({ socialLinks }: PublicSocialProps) => {
  const links = [
    { key: "instagram", url: socialLinks.instagram, icon: Instagram, label: "Instagram", color: "hover:bg-pink-500/10 hover:text-pink-500" },
    { key: "facebook", url: socialLinks.facebook, icon: Facebook, label: "Facebook", color: "hover:bg-blue-500/10 hover:text-blue-500" },
    { key: "whatsapp", url: socialLinks.whatsapp, icon: MessageCircle, label: "WhatsApp", color: "hover:bg-green-500/10 hover:text-green-500" },
    { key: "website", url: socialLinks.website, icon: Globe, label: "Site", color: "hover:bg-primary/10 hover:text-primary" },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-foreground text-center mb-6">
          Siga-nos nas redes sociais
        </h3>
        <div className="flex items-center justify-center gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center transition-all",
                  link.color
                )}
                title={link.label}
              >
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
