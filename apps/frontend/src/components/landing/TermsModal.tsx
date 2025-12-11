import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Termos de Uso</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <p className="text-xs text-muted-foreground">
              Última atualização: 01 de Dezembro de 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Aceitação dos Termos</h3>
              <p>
                Ao acessar e utilizar a plataforma Belezeiro, você concorda em cumprir e estar vinculado 
                a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não 
                deverá utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Descrição do Serviço</h3>
              <p>
                O Belezeiro é uma plataforma de gestão para profissionais e estabelecimentos do setor 
                de beleza, oferecendo funcionalidades como:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Gestão de agenda e agendamentos</li>
                <li>Cadastro e gestão de clientes</li>
                <li>Catálogo de serviços</li>
                <li>Página pública para divulgação</li>
                <li>Agendamento online</li>
                <li>Secretário Online com inteligência artificial</li>
                <li>Relatórios e métricas</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Cadastro e Conta</h3>
              <p>
                Para utilizar nossos serviços, você deve criar uma conta fornecendo informações 
                verdadeiras, completas e atualizadas. Você é responsável por manter a confidencialidade 
                de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Uso Aceitável</h3>
              <p>Você concorda em utilizar o Belezeiro apenas para fins legais e de acordo com estes Termos. É proibido:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Infringir direitos de propriedade intelectual</li>
                <li>Transmitir conteúdo ilegal, ofensivo ou prejudicial</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Usar o serviço para spam ou comunicações não solicitadas</li>
                <li>Interferir no funcionamento da plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Planos e Pagamentos</h3>
              <p>
                O Belezeiro oferece planos gratuitos e pagos. Os planos pagos são cobrados mensalmente 
                ou anualmente, conforme escolha do usuário. Os pagamentos são processados por meio de 
                processadores de pagamento terceirizados seguros.
              </p>
              <p className="mt-2">
                Você pode cancelar sua assinatura a qualquer momento. O cancelamento será efetivado 
                ao final do período já pago, sem reembolso proporcional.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Propriedade Intelectual</h3>
              <p>
                Todo o conteúdo da plataforma, incluindo mas não limitado a textos, gráficos, logos, 
                ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é 
                propriedade do Belezeiro ou de seus fornecedores de conteúdo e está protegido por 
                leis de direitos autorais.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Dados do Usuário</h3>
              <p>
                Você mantém a propriedade de todos os dados inseridos na plataforma. Ao utilizar 
                nossos serviços, você nos concede uma licença limitada para armazenar, processar e 
                exibir esses dados conforme necessário para a prestação do serviço.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Limitação de Responsabilidade</h3>
              <p>
                O Belezeiro não será responsável por danos indiretos, incidentais, especiais, 
                consequenciais ou punitivos, incluindo perda de lucros, dados, uso ou outras 
                perdas intangíveis resultantes do uso ou incapacidade de usar o serviço.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Disponibilidade do Serviço</h3>
              <p>
                Nos esforçamos para manter o serviço disponível 24 horas por dia, 7 dias por semana. 
                No entanto, não garantimos que o serviço será ininterrupto ou livre de erros. 
                Podemos realizar manutenções programadas com aviso prévio sempre que possível.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">10. Alterações nos Termos</h3>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações 
                significativas serão comunicadas por e-mail ou através de aviso na plataforma. 
                O uso continuado do serviço após tais modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">11. Rescisão</h3>
              <p>
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por qualquer 
                violação destes Termos. Você também pode encerrar sua conta a qualquer momento 
                através das configurações da plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">12. Lei Aplicável</h3>
              <p>
                Estes Termos serão regidos e interpretados de acordo com as leis da República 
                Federativa do Brasil. Qualquer disputa será submetida à jurisdição exclusiva dos 
                tribunais da cidade de São Paulo, SP.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">13. Contato</h3>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
                do e-mail: <span className="text-primary">legal@belezeiro.com.br</span>
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
