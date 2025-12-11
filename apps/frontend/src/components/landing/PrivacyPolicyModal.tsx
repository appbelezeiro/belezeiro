import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({ open, onOpenChange }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Política de Privacidade</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <p className="text-xs text-muted-foreground">
              Última atualização: 01 de Dezembro de 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Introdução</h3>
              <p>
                A sua privacidade é importante para nós. Esta Política de Privacidade explica como 
                o Belezeiro coleta, usa, divulga e protege suas informações pessoais quando você 
                utiliza nossa plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Informações que Coletamos</h3>
              <p className="font-medium text-foreground">2.1 Informações fornecidas por você:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Nome completo e nome do estabelecimento</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Endereço comercial</li>
                <li>Informações de pagamento (processadas por terceiros)</li>
                <li>Dados de clientes cadastrados por você</li>
                <li>Informações de serviços e agendamentos</li>
              </ul>
              <p className="font-medium text-foreground mt-4">2.2 Informações coletadas automaticamente:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Endereço IP e localização aproximada</li>
                <li>Tipo de dispositivo e navegador</li>
                <li>Páginas visitadas e tempo de uso</li>
                <li>Dados de interação com a plataforma</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Como Usamos suas Informações</h3>
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar notificações relacionadas</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Enviar comunicações de marketing (com seu consentimento)</li>
                <li>Responder a suas solicitações de suporte</li>
                <li>Detectar e prevenir fraudes e atividades ilegais</li>
                <li>Cumprir obrigações legais</li>
                <li>Gerar análises e relatórios agregados</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Compartilhamento de Informações</h3>
              <p>Podemos compartilhar suas informações com:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Prestadores de serviços:</strong> empresas que nos ajudam a operar a plataforma</li>
                <li><strong>Processadores de pagamento:</strong> para processar transações financeiras</li>
                <li><strong>Parceiros de integração:</strong> quando você ativa integrações específicas</li>
                <li><strong>Autoridades legais:</strong> quando exigido por lei ou processo legal</li>
              </ul>
              <p className="mt-2">
                Não vendemos suas informações pessoais a terceiros para fins de marketing.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Segurança dos Dados</h3>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações contra acesso não autorizado, alteração, divulgação ou destruição. 
                Isso inclui:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Criptografia de dados em trânsito (SSL/TLS)</li>
                <li>Criptografia de dados sensíveis em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
                <li>Treinamento de equipe em segurança da informação</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Retenção de Dados</h3>
              <p>
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e 
                cumprir obrigações legais. Após o encerramento da conta, podemos reter alguns 
                dados por períodos adicionais conforme exigido por lei ou para fins legítimos 
                de negócio.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Seus Direitos (LGPD)</h3>
              <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> corrigir dados incompletos ou inexatos</li>
                <li><strong>Eliminação:</strong> solicitar a exclusão dos seus dados</li>
                <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> retirar consentimento a qualquer momento</li>
                <li><strong>Informação:</strong> saber com quem seus dados são compartilhados</li>
                <li><strong>Oposição:</strong> se opor ao tratamento em certas circunstâncias</li>
              </ul>
              <p className="mt-2">
                Para exercer esses direitos, entre em contato através do e-mail: 
                <span className="text-primary"> privacidade@belezeiro.com.br</span>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Transferências Internacionais</h3>
              <p>
                Seus dados podem ser transferidos e processados em servidores localizados fora do 
                Brasil. Quando isso ocorre, garantimos que existam salvaguardas adequadas para 
                proteger suas informações de acordo com esta política e a legislação aplicável.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Menores de Idade</h3>
              <p>
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
                intencionalmente informações de menores. Se tomarmos conhecimento de que 
                coletamos dados de um menor, tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">10. Alterações nesta Política</h3>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
                sobre alterações significativas por e-mail ou através de aviso na plataforma. 
                Recomendamos revisar esta política regularmente.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">11. Contato</h3>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
                seus dados, entre em contato:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li><strong>E-mail:</strong> <span className="text-primary">privacidade@belezeiro.com.br</span></li>
                <li><strong>Encarregado de Dados (DPO):</strong> <span className="text-primary">dpo@belezeiro.com.br</span></li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
