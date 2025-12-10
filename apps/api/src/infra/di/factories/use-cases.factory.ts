import { CreateUserUseCase } from '@/application/usecases/create-user.usecase';
import { AuthenticateWithProviderUseCase } from '@/application/usecases/authenticate-with-provider.usecase';
import { RefreshTokensUseCase } from '@/application/usecases/refresh-tokens.usecase';
import { GetProfileUseCase } from '@/application/usecases/get-profile.usecase';
import { CreateBookingRuleUseCase } from '@/application/usecases/create-booking-rule.usecase';
import { UpdateBookingRuleUseCase } from '@/application/usecases/update-booking-rule.usecase';
import { DeleteBookingRuleUseCase } from '@/application/usecases/delete-booking-rule.usecase';
import { GetBookingRulesByUserUseCase } from '@/application/usecases/get-booking-rules-by-user.usecase';
import { CreateBookingExceptionUseCase } from '@/application/usecases/create-booking-exception.usecase';
import { UpdateBookingExceptionUseCase } from '@/application/usecases/update-booking-exception.usecase';
import { DeleteBookingExceptionUseCase } from '@/application/usecases/delete-booking-exception.usecase';
import { GetBookingExceptionsByUserUseCase } from '@/application/usecases/get-booking-exceptions-by-user.usecase';
import { CreateBookingUseCase } from '@/application/usecases/create-booking.usecase';
import { CancelBookingUseCase } from '@/application/usecases/cancel-booking.usecase';
import { GetAvailableDaysUseCase } from '@/application/usecases/get-available-days.usecase';
import { GetAvailableSlotsUseCase } from '@/application/usecases/get-available-slots.usecase';
import { CreateOrganizationUseCase } from '@/application/usecases/create-organization.usecase';
import { GetOrganizationByIdUseCase } from '@/application/usecases/get-organization-by-id.usecase';
import { GetOrganizationByOwnerUseCase } from '@/application/usecases/get-organization-by-owner.usecase';
import { UpdateOrganizationUseCase } from '@/application/usecases/update-organization.usecase';
import { CreateUnitUseCase } from '@/application/usecases/create-unit.usecase';
import { GetUnitByIdUseCase } from '@/application/usecases/get-unit-by-id.usecase';
import { ListUnitsByOrganizationUseCase } from '@/application/usecases/list-units-by-organization.usecase';
import { UpdateUnitUseCase } from '@/application/usecases/update-unit.usecase';
import { ListActiveUnitsUseCase } from '@/application/usecases/list-active-units.usecase';
import { CreatePlanUseCase } from '@/application/usecases/create-plan.usecase';
import { ListActivePlansUseCase } from '@/application/usecases/list-active-plans.usecase';
import { GetPlanByIdUseCase } from '@/application/usecases/get-plan-by-id.usecase';
import { CreateCheckoutSessionUseCase } from '@/application/usecases/create-checkout-session.usecase';
import { GetSubscriptionByUnitUseCase } from '@/application/usecases/get-subscription-by-unit.usecase';
import { CancelSubscriptionUseCase } from '@/application/usecases/cancel-subscription.usecase';
import { HandleCheckoutCompletedWebhookUseCase } from '@/application/usecases/handle-checkout-completed-webhook.usecase';
import { HandleSubscriptionUpdatedWebhookUseCase } from '@/application/usecases/handle-subscription-updated-webhook.usecase';
import { ValidateDiscountCodeUseCase } from '@/application/usecases/validate-discount-code.usecase';
import type { Repositories } from './repositories.factory';
import type { Services } from './services.factory';

export function createUseCases(repositories: Repositories, services: Services) {
  return {
    // User use cases
    create_user: new CreateUserUseCase(repositories.user_repository),

    // Auth use cases
    authenticate_with_provider: new AuthenticateWithProviderUseCase(repositories.user_repository),
    refresh_tokens: new RefreshTokensUseCase(services.token_service),
    get_profile: new GetProfileUseCase(repositories.user_repository),

    // Booking Rule use cases
    create_booking_rule: new CreateBookingRuleUseCase(repositories.booking_rule_repository),
    update_booking_rule: new UpdateBookingRuleUseCase(repositories.booking_rule_repository),
    delete_booking_rule: new DeleteBookingRuleUseCase(repositories.booking_rule_repository),
    get_booking_rules_by_user: new GetBookingRulesByUserUseCase(
      repositories.booking_rule_repository,
    ),

    // Booking Exception use cases
    create_booking_exception: new CreateBookingExceptionUseCase(
      repositories.booking_exception_repository,
    ),
    update_booking_exception: new UpdateBookingExceptionUseCase(
      repositories.booking_exception_repository,
    ),
    delete_booking_exception: new DeleteBookingExceptionUseCase(
      repositories.booking_exception_repository,
    ),
    get_booking_exceptions_by_user: new GetBookingExceptionsByUserUseCase(
      repositories.booking_exception_repository,
    ),

    // Booking use cases
    create_booking: new CreateBookingUseCase(
      repositories.booking_repository,
      repositories.booking_rule_repository,
      repositories.booking_exception_repository,
    ),
    cancel_booking: new CancelBookingUseCase(repositories.booking_repository),

    // Availability use cases
    get_available_days: new GetAvailableDaysUseCase(
      repositories.booking_rule_repository,
      repositories.booking_exception_repository,
      repositories.booking_repository,
    ),
    get_available_slots: new GetAvailableSlotsUseCase(
      repositories.booking_rule_repository,
      repositories.booking_exception_repository,
      repositories.booking_repository,
    ),

    // Organization use cases
    create_organization: new CreateOrganizationUseCase(repositories.organization_repository),
    get_organization_by_id: new GetOrganizationByIdUseCase(repositories.organization_repository),
    get_organization_by_owner: new GetOrganizationByOwnerUseCase(
      repositories.organization_repository,
    ),
    update_organization: new UpdateOrganizationUseCase(repositories.organization_repository),

    // Unit use cases
    create_unit: new CreateUnitUseCase(repositories.unit_repository),
    get_unit_by_id: new GetUnitByIdUseCase(repositories.unit_repository),
    list_units_by_organization: new ListUnitsByOrganizationUseCase(repositories.unit_repository),
    update_unit: new UpdateUnitUseCase(repositories.unit_repository),
    list_active_units: new ListActiveUnitsUseCase(repositories.unit_repository),

    // Billing - Plan use cases
    create_plan: new CreatePlanUseCase(repositories.plan_repository),
    list_active_plans: new ListActivePlansUseCase(repositories.plan_repository),
    get_plan_by_id: new GetPlanByIdUseCase(repositories.plan_repository),

    // Billing - Subscription use cases
    create_checkout_session: new CreateCheckoutSessionUseCase(
      repositories.plan_repository,
      services.payment_gateway,
    ),
    get_subscription_by_unit: new GetSubscriptionByUnitUseCase(repositories.subscription_repository),
    cancel_subscription: new CancelSubscriptionUseCase(
      repositories.subscription_repository,
      services.payment_gateway,
    ),

    // Billing - Webhook use cases
    handle_checkout_completed_webhook: new HandleCheckoutCompletedWebhookUseCase(
      repositories.subscription_repository,
      repositories.plan_repository,
      repositories.discount_repository,
    ),
    handle_subscription_updated_webhook: new HandleSubscriptionUpdatedWebhookUseCase(
      repositories.subscription_repository,
    ),

    // Billing - Discount use cases
    validate_discount_code: new ValidateDiscountCodeUseCase(repositories.discount_repository),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
