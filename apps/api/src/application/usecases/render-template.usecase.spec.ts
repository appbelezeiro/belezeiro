import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { RenderTemplateUseCase } from './render-template.usecase';
import { InMemoryNotificationTemplateRepository } from '@/infra/repositories/in-memory/in-memory-notification-template.repository';
import { HandlebarsTemplateRendererService } from '@/infra/services/handlebars-template-renderer.service';
import { NotificationTemplateEntity } from '@/domain/entities/notification-template.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { TemplateNotFoundError } from '@/domain/errors/template-not-found.error';
import { TemplateVariablesMismatchError } from '@/domain/errors/template-variables-mismatch.error';

describe('RenderTemplateUseCase', () => {
  let sut: RenderTemplateUseCase;
  let template_repository: InMemoryNotificationTemplateRepository;
  let template_renderer: HandlebarsTemplateRendererService;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    template_repository = new InMemoryNotificationTemplateRepository();
    template_renderer = new HandlebarsTemplateRendererService();

    sut = new RenderTemplateUseCase(template_repository, template_renderer);
  });

  it('should render email template successfully', async () => {
    const template = new NotificationTemplateEntity({
      name: 'welcome_email',
      channel: 'email',
      subject: 'Welcome {{user_name}}!',
      body_template: '<h1>Hello {{user_name}}</h1><p>Your email is {{email}}</p>',
      variables: ['user_name', 'email'],
    });

    await template_repository.create(template);

    const result = await sut.execute({
      template_id: template.id,
      payload: {
        user_name: 'John Doe',
        email: 'john@example.com',
      },
    });

    expect(result.rendered_subject).toBe('Welcome John Doe!');
    expect(result.rendered_body).toContain('Hello John Doe');
    expect(result.rendered_body).toContain('john@example.com');
  });

  it('should render whatsapp template successfully', async () => {
    const template = new NotificationTemplateEntity({
      name: 'booking_confirmation',
      channel: 'whatsapp',
      body_template:
        'Hi {{customer_name}}, your booking for {{service}} on {{date}} is confirmed!',
      variables: ['customer_name', 'service', 'date'],
    });

    await template_repository.create(template);

    const result = await sut.execute({
      template_id: template.id,
      payload: {
        customer_name: 'Jane Smith',
        service: 'Haircut',
        date: '2024-01-20',
      },
    });

    expect(result.rendered_body).toBe(
      'Hi Jane Smith, your booking for Haircut on 2024-01-20 is confirmed!'
    );
  });

  it('should render push template with title and body', async () => {
    const template = new NotificationTemplateEntity({
      name: 'new_message',
      channel: 'push',
      title_template: 'New message from {{sender}}',
      body_template: '{{message_preview}}',
      variables: ['sender', 'message_preview'],
    });

    await template_repository.create(template);

    const result = await sut.execute({
      template_id: template.id,
      payload: {
        sender: 'Alice',
        message_preview: 'Hey, how are you?',
      },
    });

    expect(result.rendered_title).toBe('New message from Alice');
    expect(result.rendered_body).toBe('Hey, how are you?');
  });

  it('should throw error if template not found', async () => {
    await expect(
      sut.execute({
        template_id: 'non_existent_template',
        payload: {},
      })
    ).rejects.toThrow(TemplateNotFoundError);
  });

  it('should throw error if template is inactive', async () => {
    const template = new NotificationTemplateEntity({
      name: 'old_template',
      channel: 'email',
      body_template: 'Old content',
      variables: [],
    });

    template.deactivate();
    await template_repository.create(template);

    await expect(
      sut.execute({
        template_id: template.id,
        payload: {},
      })
    ).rejects.toThrow(TemplateNotFoundError);
  });

  it('should throw error if required variables are missing', async () => {
    const template = new NotificationTemplateEntity({
      name: 'user_notification',
      channel: 'email',
      body_template: 'Hello {{user_name}}, welcome!',
      variables: ['user_name', 'email'],
    });

    await template_repository.create(template);

    await expect(
      sut.execute({
        template_id: template.id,
        payload: {
          user_name: 'John',
          // email is missing
        },
      })
    ).rejects.toThrow(TemplateVariablesMismatchError);
  });

  it('should handle template with no subject (whatsapp/push)', async () => {
    const template = new NotificationTemplateEntity({
      name: 'simple_notification',
      channel: 'whatsapp',
      body_template: 'Hello {{name}}',
      variables: ['name'],
    });

    await template_repository.create(template);

    const result = await sut.execute({
      template_id: template.id,
      payload: {
        name: 'Bob',
      },
    });

    expect(result.rendered_subject).toBeUndefined();
    expect(result.rendered_body).toBe('Hello Bob');
  });

  it('should return template metadata', async () => {
    const template = new NotificationTemplateEntity({
      name: 'test_template',
      channel: 'email',
      body_template: 'Test',
      variables: [],
    });

    await template_repository.create(template);

    const result = await sut.execute({
      template_id: template.id,
      payload: {},
    });

    expect(result.template).toBeDefined();
    expect(result.template.id).toBe(template.id);
    expect(result.template.name).toBe('test_template');
    expect(result.template.channel).toBe('email');
  });
});
