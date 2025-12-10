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
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
