import { NotificationTemplateEntity } from '@/domain/entities/notification-template.entity';
import { INotificationTemplateRepository } from '@/application/contracts/i-notification-template-repository.interface';
import { ITemplateRenderer } from '@/domain/services/i-template-renderer.interface';
import { TemplateNotFoundError } from '@/domain/errors/template-not-found.error';
import { TemplateVariablesMismatchError } from '@/domain/errors/template-variables-mismatch.error';

class UseCase {
  constructor(
    private readonly template_repository: INotificationTemplateRepository,
    private readonly template_renderer: ITemplateRenderer
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Busca template
    const template = await this.template_repository.find_by_id(input.template_id);

    if (!template) {
      throw new TemplateNotFoundError(
        `Template with id ${input.template_id} not found`
      );
    }

    if (!template.is_active) {
      throw new TemplateNotFoundError(
        `Template ${input.template_id} is inactive`
      );
    }

    // 2. Valida variáveis
    if (!template.validate_variables(input.payload)) {
      const missing = template.variables.filter(
        (variable) => !(variable in input.payload)
      );
      throw new TemplateVariablesMismatchError(
        `Missing variables: ${missing.join(', ')}`
      );
    }

    // 3. Renderiza templates
    const rendered_body = this.template_renderer.render(
      template.body_template,
      input.payload
    );

    const rendered_subject = template.subject
      ? this.template_renderer.render(template.subject, input.payload)
      : undefined;

    const rendered_title = template.title_template
      ? this.template_renderer.render(template.title_template, input.payload)
      : undefined;

    return {
      template,
      rendered_body,
      rendered_subject,
      rendered_title,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    template_id: string;
    payload: Record<string, any>;
  };

  export type Output = Promise<{
    template: NotificationTemplateEntity;
    rendered_body: string;
    rendered_subject?: string;
    rendered_title?: string;
  }>;
}

export { UseCase as RenderTemplateUseCase };
