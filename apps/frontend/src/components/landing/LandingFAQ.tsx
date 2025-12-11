import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O Belezeiro é gratuito?",
    answer: "Sim! Oferecemos um plano gratuito com funcionalidades essenciais para você começar. Você pode usar a agenda básica, cadastrar serviços e gerenciar até 50 agendamentos por mês sem pagar nada.",
  },
  {
    question: "Preciso de cartão de crédito para começar?",
    answer: "Não. Você pode criar sua conta e usar o plano gratuito sem informar dados de pagamento. Só pedimos o cartão se você decidir assinar o plano Pro.",
  },
  {
    question: "Como funciona o período de teste do Pro?",
    answer: "Ao criar sua conta, você ganha 7 dias de acesso gratuito a todas as funcionalidades do plano Pro, incluindo o Secretário Online. Depois, você pode continuar no plano gratuito ou assinar o Pro.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há fidelidade, multas ou taxas de cancelamento. Após cancelar, você continua com acesso até o fim do período pago.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Absolutamente. Usamos criptografia de ponta a ponta e servidores seguros. Seus dados nunca são compartilhados com terceiros e você pode excluir sua conta e informações a qualquer momento.",
  },
  {
    question: "O que é o Secretário Online?",
    answer: "É nossa inteligência artificial que responde seus clientes no WhatsApp 24 horas por dia. Ela tira dúvidas, confirma horários, agenda clientes e envia lembretes automaticamente. Disponível no plano Pro.",
  },
  {
    question: "Como meus clientes agendam online?",
    answer: "Você ganha uma página pública personalizada com link próprio. Seus clientes acessam, escolhem o serviço, profissional, data e horário. Tudo automático, sem você precisar responder mensagens.",
  },
  {
    question: "Posso gerenciar mais de uma unidade?",
    answer: "No plano gratuito você gerencia 1 unidade. No plano Pro, você tem unidades ilimitadas, cada uma com sua própria agenda, equipe e serviços. Ideal para quem tem filiais.",
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim! No plano gratuito você tem suporte por e-mail. No plano Pro, oferecemos suporte prioritário com tempo de resposta mais rápido e atendimento personalizado.",
  },
  {
    question: "Como faço para migrar meus dados?",
    answer: "Se você já usa outra ferramenta, nossa equipe pode ajudar na migração. Entre em contato conosco e faremos o possível para transferir seus clientes e histórico sem dor de cabeça.",
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perguntas{" "}
            <span className="text-primary">Frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre o Belezeiro. Se não encontrar o que procura, 
            fale conosco.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
