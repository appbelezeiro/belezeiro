import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CookiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiesModal({ open, onOpenChange }: CookiesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Política de Cookies</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <p className="text-xs text-muted-foreground">
              Última atualização: 01 de Dezembro de 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. O que são Cookies?</h3>
              <p>
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo 
                (computador, tablet ou celular) quando você visita um site. Eles são amplamente 
                utilizados para fazer os sites funcionarem de forma mais eficiente, bem como 
                fornecer informações aos proprietários do site.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Como Usamos Cookies</h3>
              <p>O Belezeiro utiliza cookies para:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Manter você conectado à sua conta</li>
                <li>Lembrar suas preferências e configurações</li>
                <li>Entender como você usa nossa plataforma</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Personalizar conteúdo e anúncios</li>
                <li>Fornecer recursos de segurança</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Tipos de Cookies que Utilizamos</h3>
              
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">🔒 Cookies Essenciais</h4>
                  <p>
                    Necessários para o funcionamento básico do site. Sem eles, você não conseguiria 
                    navegar pelo site ou usar recursos como login e carrinho de compras.
                  </p>
                  <p className="text-xs mt-2"><strong>Duração:</strong> Sessão ou até 1 ano</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">⚙️ Cookies de Funcionalidade</h4>
                  <p>
                    Permitem que o site lembre suas escolhas (como idioma ou região) e forneça 
                    recursos aprimorados e mais personalizados.
                  </p>
                  <p className="text-xs mt-2"><strong>Duração:</strong> Até 2 anos</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">📊 Cookies de Análise</h4>
                  <p>
                    Nos ajudam a entender como os visitantes interagem com o site, coletando 
                    informações de forma anônima. Usamos essas informações para melhorar nosso site.
                  </p>
                  <p className="text-xs mt-2"><strong>Duração:</strong> Até 2 anos</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">🎯 Cookies de Marketing</h4>
                  <p>
                    Usados para rastrear visitantes em sites. A intenção é exibir anúncios 
                    relevantes e envolventes para o usuário individual.
                  </p>
                  <p className="text-xs mt-2"><strong>Duração:</strong> Até 2 anos</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Cookies de Terceiros</h3>
              <p>Utilizamos serviços de terceiros que também podem definir cookies:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento</li>
                <li><strong>Google Ads:</strong> Para publicidade personalizada</li>
                <li><strong>Facebook Pixel:</strong> Para remarketing e análise</li>
                <li><strong>Hotjar:</strong> Para análise de experiência do usuário</li>
                <li><strong>Intercom:</strong> Para suporte ao cliente</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Gerenciando Cookies</h3>
              <p>
                Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir 
                todos os cookies que já estão no seu computador e configurar a maioria dos 
                navegadores para impedir que sejam colocados.
              </p>
              
              <p className="mt-4 font-medium text-foreground">Como gerenciar cookies no seu navegador:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
              </ul>

              <p className="mt-4 text-amber-600 dark:text-amber-400">
                ⚠️ Atenção: Desativar cookies pode afetar a funcionalidade do site e impedir 
                que você use alguns de nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Tecnologias Similares</h3>
              <p>Além de cookies, também utilizamos:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong>Local Storage:</strong> Armazenamento local no navegador para 
                  preferências e dados da sessão
                </li>
                <li>
                  <strong>Web Beacons:</strong> Pequenas imagens transparentes usadas para 
                  rastrear comportamento e medir engajamento
                </li>
                <li>
                  <strong>Pixel Tags:</strong> Código incorporado em e-mails para verificar 
                  se foram abertos
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Atualizações desta Política</h3>
              <p>
                Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças 
                em nossas práticas ou por outras razões operacionais, legais ou regulatórias. 
                Recomendamos que você revise esta página regularmente.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Consentimento</h3>
              <p>
                Ao continuar navegando em nosso site, você concorda com o uso de cookies conforme 
                descrito nesta política. Você pode retirar seu consentimento a qualquer momento 
                ajustando as configurações do seu navegador.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Contato</h3>
              <p>
                Se você tiver dúvidas sobre o uso de cookies ou esta política, entre em contato:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail:</strong> <span className="text-primary">privacidade@belezeiro.com.br</span></li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
