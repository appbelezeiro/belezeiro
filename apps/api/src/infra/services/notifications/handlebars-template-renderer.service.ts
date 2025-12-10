import { ITemplateRenderer } from '@/domain/services/notifications/i-template-renderer.interface';
import Handlebars from 'handlebars';

export class HandlebarsTemplateRendererService implements ITemplateRenderer {
  render(template: string, variables: Record<string, any>): string {
    const compiled = Handlebars.compile(template);
    return compiled(variables);
  }
}
