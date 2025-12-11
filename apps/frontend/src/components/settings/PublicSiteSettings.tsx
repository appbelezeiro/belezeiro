import { useState, useEffect } from "react";
import {
  Globe,
  ExternalLink,
  Instagram,
  Facebook,
  MessageCircle,
  Link2,
  Eye,
  Save,
  AlertCircle,
  Info,
  Lock,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PublicSitePreview } from "./PublicSitePreview";
import { usePlan } from "@/contexts/AppContext";
import { FormInput, FormTextarea } from "@/shared/components/form";
import { publicSiteSchema } from "@/shared/schemas/settings.schemas";
import { z } from "zod";

export const PublicSiteSettings = () => {
  const { toast } = useToast();
  const { isPro } = usePlan();
  
  // Site status
  const [isSiteEnabled, setIsSiteEnabled] = useState(true);
  
  // Content settings
  const [siteTitle, setSiteTitle] = useState("Studio Julia Alves — Estética Avançada");
  const [siteHeadline, setSiteHeadline] = useState("Especialistas em estética facial e corporal, com atendimento humanizado e resultados naturais.");
  const [aboutUs, setAboutUs] = useState("Somos um estúdio dedicado a realçar a sua beleza natural. Com mais de 10 anos de experiência no mercado, nossa equipe de profissionais altamente qualificados utiliza as técnicas mais modernas e equipamentos de última geração para garantir resultados excepcionais. Acreditamos que cada cliente é único e merece um atendimento personalizado.");
  
  // Social links
  const [instagram, setInstagram] = useState("https://instagram.com/studiojuliaalves");
  const [facebook, setFacebook] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999");
  const [externalSite, setExternalSite] = useState("");
  
  // Track changes
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState<string>("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const currentState = JSON.stringify({
      isSiteEnabled, siteTitle, siteHeadline, 
      aboutUs, instagram, facebook, whatsappLink, externalSite
    });
    
    if (!initialState) {
      setInitialState(currentState);
    } else {
      setHasChanges(currentState !== initialState);
    }
  }, [isSiteEnabled, siteTitle, siteHeadline, aboutUs, instagram, facebook, whatsappLink, externalSite, initialState]);

  const handleSave = () => {
    try {
      publicSiteSchema.parse({
        siteTitle: siteTitle.trim() || undefined,
        siteHeadline: siteHeadline.trim() || undefined,
        aboutUs: aboutUs.trim() || undefined,
        instagram: instagram.trim() || undefined,
        facebook: facebook.trim() || undefined,
        whatsappLink: whatsappLink.trim() || undefined,
        externalSite: externalSite.trim() || undefined,
      });
      setErrors({});
      toast({
        title: "Configurações salvas!",
        description: "As configurações do site público foram atualizadas.",
      });
      setInitialState(JSON.stringify({
        isSiteEnabled, siteTitle, siteHeadline,
        aboutUs, instagram, facebook, whatsappLink, externalSite
      }));
      setHasChanges(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const siteUrl = `belezeiro.com/studio-julia-alves`;

  // Social links object for preview
  const socialLinks = {
    instagram,
    facebook,
    whatsapp: whatsappLink,
    website: externalSite,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Site Público
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure a página pública da sua unidade
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Settings Column */}
        <div className="space-y-6">
          {/* Site Status */}
          <div className="bg-muted/30 rounded-lg border border-border p-5 space-y-4">
            <h3 className="font-medium text-foreground">Status do Site</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Ativar site público</Label>
                  <p className="text-xs text-muted-foreground">
                    Quando desativado, o site fica offline
                  </p>
                </div>
                <Switch checked={isSiteEnabled} onCheckedChange={setIsSiteEnabled} />
              </div>
              
              {!isSiteEnabled && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Seu site está offline. Visitantes verão uma página de indisponibilidade.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Settings */}
          <div className="bg-muted/30 rounded-lg border border-border p-5 space-y-4">
            <h3 className="font-medium text-foreground">Conteúdo do Site</h3>
            
            {/* Disclaimer about logo and gallery */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                A <strong className="text-foreground">logo</strong> e a <strong className="text-foreground">galeria de fotos</strong> são obtidas automaticamente das configurações da sua empresa em <strong className="text-foreground">Meu Negócio</strong>. Para alterá-las, acesse aquele módulo.
              </p>
            </div>
            
            <div className="space-y-4">
              <FormInput
                label="Título principal"
                id="site-title"
                placeholder="Ex: Studio Julia Alves — Estética Avançada"
                value={siteTitle}
                onChange={(e) => {
                  setSiteTitle(e.target.value);
                  clearError("siteTitle");
                }}
                error={errors.siteTitle}
              />

              <FormTextarea
                label="Headline curta"
                id="site-headline"
                placeholder="Uma frase impactante que aparece logo abaixo do título..."
                value={siteHeadline}
                onChange={(e) => {
                  setSiteHeadline(e.target.value);
                  clearError("siteHeadline");
                }}
                rows={2}
                error={errors.siteHeadline}
                hint="Esse é o primeiro texto que o visitante lê após o título. Capriche nas palavras para causar uma boa primeira impressão e mostrar seu diferencial."
              />

              <FormTextarea
                label="Sobre nós"
                id="about-us"
                placeholder="Conte a história do seu negócio, sua experiência, diferenciais..."
                value={aboutUs}
                onChange={(e) => {
                  setAboutUs(e.target.value);
                  clearError("aboutUs");
                }}
                rows={5}
                error={errors.aboutUs}
                hint="Aqui você pode detalhar mais sobre sua trajetória, equipe, valores e tudo que faz seu trabalho único. Esse texto aparece na seção &quot;Sobre&quot; do seu site."
              />
            </div>
          </div>

          {/* Social Links */}
          <div className={cn(
            "bg-muted/30 rounded-lg border border-border p-5 space-y-4 relative",
            !isPro && "opacity-60"
          )}>
            {!isPro && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">Funcionalidade Pro</span>
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-[280px]">
                  As redes sociais e ícones de contato são exclusivos do plano Pro
                </p>
                <Button size="sm" className="gap-2 mt-1">
                  <Crown className="h-4 w-4" />
                  Fazer upgrade
                </Button>
              </div>
            )}
            
            <h3 className="font-medium text-foreground">Redes Sociais</h3>
            
            <div className="space-y-4">
              <FormInput
                label={
                  <span className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </span>
                }
                id="instagram"
                placeholder="https://instagram.com/seuusuario"
                value={instagram}
                onChange={(e) => {
                  setInstagram(e.target.value);
                  clearError("instagram");
                }}
                disabled={!isPro}
                error={errors.instagram}
              />

              <FormInput
                label={
                  <span className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </span>
                }
                id="facebook"
                placeholder="https://facebook.com/suapagina"
                value={facebook}
                onChange={(e) => {
                  setFacebook(e.target.value);
                  clearError("facebook");
                }}
                disabled={!isPro}
                error={errors.facebook}
              />

              <FormInput
                label={
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp (wa.me)
                  </span>
                }
                id="whatsapp"
                placeholder="https://wa.me/5511999999999"
                value={whatsappLink}
                onChange={(e) => {
                  setWhatsappLink(e.target.value);
                  clearError("whatsappLink");
                }}
                disabled={!isPro}
                error={errors.whatsappLink}
              />

              <FormInput
                label={
                  <span className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Site externo (opcional)
                  </span>
                }
                id="external-site"
                placeholder="https://seusite.com.br"
                value={externalSite}
                onChange={(e) => {
                  setExternalSite(e.target.value);
                  clearError("externalSite");
                }}
                disabled={!isPro}
                error={errors.externalSite}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <a
              href="/u/studio-julia-alves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              Ver site público
            </a>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar configurações
            </Button>
          </div>
        </div>

        {/* Preview Column */}
        <div className="hidden xl:block">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Preview</span>
              <Badge variant="secondary" className="text-xs">
                {siteUrl}
              </Badge>
            </div>
            <PublicSitePreview
              isEnabled={isSiteEnabled}
              isBookingEnabled={true}
              title={siteTitle}
              description={siteHeadline}
              socialLinks={isPro ? socialLinks : {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
