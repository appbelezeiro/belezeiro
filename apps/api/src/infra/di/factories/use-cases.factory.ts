import { CompleteOnboardingUseCase } from '@/application/usecases/users/complete-onboarding.usecase';
import { AuthenticateWithProviderUseCase } from '@/application/usecases/auth/authenticate-with-provider.usecase';
import { RefreshTokensUseCase } from '@/application/usecases/auth/refresh-tokens.usecase';
import { GetProfileUseCase } from '@/application/usecases/users/get-profile.usecase';
import { CreateBookingRuleUseCase } from '@/application/usecases/bookings/create-booking-rule.usecase';
import { UpdateBookingRuleUseCase } from '@/application/usecases/bookings/update-booking-rule.usecase';
import { DeleteBookingRuleUseCase } from '@/application/usecases/bookings/delete-booking-rule.usecase';
import { GetBookingRulesByUserUseCase } from '@/application/usecases/bookings/get-booking-rules-by-user.usecase';
import { CreateBookingExceptionUseCase } from '@/application/usecases/bookings/create-booking-exception.usecase';
import { UpdateBookingExceptionUseCase } from '@/application/usecases/bookings/update-booking-exception.usecase';
import { DeleteBookingExceptionUseCase } from '@/application/usecases/bookings/delete-booking-exception.usecase';
import { GetBookingExceptionsByUserUseCase } from '@/application/usecases/bookings/get-booking-exceptions-by-user.usecase';
import { CreateBookingUseCase } from '@/application/usecases/bookings/create-booking.usecase';
import { CancelBookingUseCase } from '@/application/usecases/bookings/cancel-booking.usecase';
import { GetAvailableDaysUseCase } from '@/application/usecases/bookings/get-available-days.usecase';
import { GetAvailableSlotsUseCase } from '@/application/usecases/bookings/get-available-slots.usecase';
import { CreateOrganizationUseCase } from '@/application/usecases/organizations/create-organization.usecase';
import { GetOrganizationByIdUseCase } from '@/application/usecases/organizations/get-organization-by-id.usecase';
import { ListOrganizationsByOwnerUseCase } from '@/application/usecases/organizations/list-organizations-by-owner.usecase';
import { UpdateOrganizationUseCase } from '@/application/usecases/organizations/update-organization.usecase';
import { CreateUnitUseCase } from '@/application/usecases/units/create-unit.usecase';
import { GetUnitByIdUseCase } from '@/application/usecases/units/get-unit-by-id.usecase';
import { ListUnitsByOrganizationUseCase } from '@/application/usecases/units/list-units-by-organization.usecase';
import { UpdateUnitUseCase } from '@/application/usecases/units/update-unit.usecase';
import { ListActiveUnitsUseCase } from '@/application/usecases/units/list-active-units.usecase';
import { CreatePlanUseCase } from '@/application/usecases/billing/create-plan.usecase';
import { ListActivePlansUseCase } from '@/application/usecases/billing/list-active-plans.usecase';
import { GetPlanByIdUseCase } from '@/application/usecases/billing/get-plan-by-id.usecase';
import { CreateCheckoutSessionUseCase } from '@/application/usecases/billing/create-checkout-session.usecase';
import { GetSubscriptionByUnitUseCase } from '@/application/usecases/units/get-subscription-by-unit.usecase';
import { CancelSubscriptionUseCase } from '@/application/usecases/billing/cancel-subscription.usecase';
import { HandleCheckoutCompletedWebhookUseCase } from '@/application/usecases/billing/handle-checkout-completed-webhook.usecase';
import { HandleSubscriptionUpdatedWebhookUseCase } from '@/application/usecases/billing/handle-subscription-updated-webhook.usecase';
import { ValidateDiscountCodeUseCase } from '@/application/usecases/billing/validate-discount-code.usecase';
import { CreateSpecialtyUseCase } from '@/application/usecases/specialty/create-specialty.usecase';
import { GetSpecialtyByIdUseCase } from '@/application/usecases/specialty/get-specialty-by-id.usecase';
import { ListSpecialtiesUseCase } from '@/application/usecases/specialty/list-specialties.usecase';
import { SearchSpecialtiesUseCase } from '@/application/usecases/specialty/search-specialties.usecase';
import { CreateServiceUseCase } from '@/application/usecases/service/create-service.usecase';
import { GetServiceByIdUseCase } from '@/application/usecases/service/get-service-by-id.usecase';
import { ListServicesUseCase } from '@/application/usecases/service/list-services.usecase';
import { SearchServicesUseCase } from '@/application/usecases/service/search-services.usecase';
import { UpdateServiceUseCase } from '@/application/usecases/service/update-service.usecase';
import { DeleteServiceUseCase } from '@/application/usecases/service/delete-service.usecase';
import { LinkUnitSpecialtyUseCase } from '@/application/usecases/unit-specialty/link-unit-specialty.usecase';
import { UnlinkUnitSpecialtyUseCase } from '@/application/usecases/unit-specialty/unlink-unit-specialty.usecase';
import { GetUnitSpecialtiesUseCase } from '@/application/usecases/unit-specialty/get-unit-specialties.usecase';
import { AddUnitServiceUseCase } from '@/application/usecases/unit-service/add-unit-service.usecase';
import { RemoveUnitServiceUseCase } from '@/application/usecases/unit-service/remove-unit-service.usecase';
import { UpdateUnitServiceConfigUseCase } from '@/application/usecases/unit-service/update-unit-service-config.usecase';
import { GetUnitServicesUseCase } from '@/application/usecases/unit-service/get-unit-services.usecase';
import { GenerateUploadUrlUseCase } from '@/application/usecases/storage/generate-upload-url.usecase';
import { GenerateBatchUploadUrlsUseCase } from '@/application/usecases/storage/generate-batch-upload-urls.usecase';
import { UpdateUserPhotoUseCase } from '@/application/usecases/users/update-user-photo.usecase';
import { UpdateUnitLogoUseCase } from '@/application/usecases/units/update-unit-logo.usecase';
import { AddUnitGalleryPhotoUseCase } from '@/application/usecases/units/add-unit-gallery-photo.usecase';
import { AddBatchUnitGalleryPhotosUseCase } from '@/application/usecases/units/add-batch-unit-gallery-photos.usecase';
import { RemoveUnitGalleryPhotoUseCase } from '@/application/usecases/units/remove-unit-gallery-photo.usecase';
import { CreateAmenityUseCase } from '@/application/usecases/amenity/create-amenity.usecase';
import { GetAmenityByIdUseCase } from '@/application/usecases/amenity/get-amenity-by-id.usecase';
import { ListAmenitiesUseCase } from '@/application/usecases/amenity/list-amenities.usecase';
import { SearchAmenitiesUseCase } from '@/application/usecases/amenity/search-amenities.usecase';
import { UpdateAmenityUseCase } from '@/application/usecases/amenity/update-amenity.usecase';
import { ActivateAmenityUseCase } from '@/application/usecases/amenity/activate-amenity.usecase';
import { DeactivateAmenityUseCase } from '@/application/usecases/amenity/deactivate-amenity.usecase';
import { LinkUnitAmenityUseCase } from '@/application/usecases/unit-amenity/link-unit-amenity.usecase';
import { UnlinkUnitAmenityUseCase } from '@/application/usecases/unit-amenity/unlink-unit-amenity.usecase';
import { GetUnitAmenitiesUseCase } from '@/application/usecases/unit-amenity/get-unit-amenities.usecase';
import { CreateUnitAvailabilityRuleUseCase } from '@/application/usecases/units/availability/create-unit-availability-rule.usecase';
import { GetUnitAvailabilityRulesByUnitUseCase } from '@/application/usecases/units/availability/get-unit-availability-rules-by-unit.usecase';
import { UpdateUnitAvailabilityRuleUseCase } from '@/application/usecases/units/availability/update-unit-availability-rule.usecase';
import { DeleteUnitAvailabilityRuleUseCase } from '@/application/usecases/units/availability/delete-unit-availability-rule.usecase';
import { BulkCreateUnitAvailabilityRulesUseCase } from '@/application/usecases/units/availability/bulk-create-unit-availability-rules.usecase';
import { CreateUnitAvailabilityExceptionUseCase } from '@/application/usecases/units/availability/create-unit-availability-exception.usecase';
import { GetUnitAvailabilityExceptionsByUnitUseCase } from '@/application/usecases/units/availability/get-unit-availability-exceptions-by-unit.usecase';
import { UpdateUnitAvailabilityExceptionUseCase } from '@/application/usecases/units/availability/update-unit-availability-exception.usecase';
import { DeleteUnitAvailabilityExceptionUseCase } from '@/application/usecases/units/availability/delete-unit-availability-exception.usecase';
import { BulkCreateUnitAvailabilityExceptionsUseCase } from '@/application/usecases/units/availability/bulk-create-unit-availability-exceptions.usecase';
import { GetUnitAvailableSlotsUseCase } from '@/application/usecases/units/availability/get-unit-available-slots.usecase';
import { MigrateUnitToAvailabilityRulesUseCase } from '@/application/usecases/units/availability/migrate-unit-to-availability-rules.usecase';
import type { Repositories } from './repositories.factory';
import type { Services } from './services.factory';

export function createUseCases(repositories: Repositories, services: Services) {
  return {
    // User use cases
    complete_onboarding: new CompleteOnboardingUseCase(repositories.user_repository),

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
      repositories.customer_repository,
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
    create_organization: new CreateOrganizationUseCase(
      repositories.organization_repository,
      repositories.user_repository,
    ),
    get_organization_by_id: new GetOrganizationByIdUseCase(repositories.organization_repository),
    list_organizations_by_owner: new ListOrganizationsByOwnerUseCase(
      repositories.organization_repository,
    ),
    update_organization: new UpdateOrganizationUseCase(repositories.organization_repository),

    // Unit Availability Rules use cases
    create_unit_availability_rule: new CreateUnitAvailabilityRuleUseCase(
      repositories.unit_availability_rule_repository,
    ),
    get_unit_availability_rules_by_unit: new GetUnitAvailabilityRulesByUnitUseCase(
      repositories.unit_availability_rule_repository,
    ),
    update_unit_availability_rule: new UpdateUnitAvailabilityRuleUseCase(
      repositories.unit_availability_rule_repository,
    ),
    delete_unit_availability_rule: new DeleteUnitAvailabilityRuleUseCase(
      repositories.unit_availability_rule_repository,
    ),
    bulk_create_unit_availability_rules: new BulkCreateUnitAvailabilityRulesUseCase(
      repositories.unit_availability_rule_repository,
    ),

    // Unit Availability Exceptions use cases
    create_unit_availability_exception: new CreateUnitAvailabilityExceptionUseCase(
      repositories.unit_availability_exception_repository,
    ),
    get_unit_availability_exceptions_by_unit: new GetUnitAvailabilityExceptionsByUnitUseCase(
      repositories.unit_availability_exception_repository,
    ),
    update_unit_availability_exception: new UpdateUnitAvailabilityExceptionUseCase(
      repositories.unit_availability_exception_repository,
    ),
    delete_unit_availability_exception: new DeleteUnitAvailabilityExceptionUseCase(
      repositories.unit_availability_exception_repository,
    ),
    bulk_create_unit_availability_exceptions: new BulkCreateUnitAvailabilityExceptionsUseCase(
      repositories.unit_availability_exception_repository,
    ),

    // Unit Availability Slots use case
    get_unit_available_slots: new GetUnitAvailableSlotsUseCase(
      repositories.unit_availability_rule_repository,
      repositories.unit_availability_exception_repository,
    ),

    // Unit Availability Migration use case
    migrate_unit_to_availability_rules: new MigrateUnitToAvailabilityRulesUseCase(
      repositories.unit_repository,
      repositories.unit_availability_rule_repository,
    ),

    // Unit use cases (updated with availability dependencies)
    create_unit: new CreateUnitUseCase(
      repositories.unit_repository,
      repositories.amenity_repository,
      repositories.specialty_repository,
      repositories.service_repository,
    ),
    get_unit_by_id: new GetUnitByIdUseCase(repositories.unit_repository),
    list_units_by_organization: new ListUnitsByOrganizationUseCase(repositories.unit_repository),
    update_unit: new UpdateUnitUseCase(
      repositories.unit_repository,
      repositories.amenity_repository,
      repositories.specialty_repository,
      repositories.service_repository,
    ),
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

    // Specialty use cases
    create_specialty: new CreateSpecialtyUseCase(repositories.specialty_repository),
    get_specialty_by_id: new GetSpecialtyByIdUseCase(repositories.specialty_repository),
    list_specialties: new ListSpecialtiesUseCase(repositories.specialty_repository),
    search_specialties: new SearchSpecialtiesUseCase(repositories.specialty_repository),

    // Service use cases
    create_service: new CreateServiceUseCase(
      repositories.service_repository,
      repositories.specialty_repository,
    ),
    get_service_by_id: new GetServiceByIdUseCase(repositories.service_repository),
    list_services: new ListServicesUseCase(repositories.service_repository),
    search_services: new SearchServicesUseCase(repositories.service_repository),
    update_service: new UpdateServiceUseCase(repositories.service_repository),
    delete_service: new DeleteServiceUseCase(repositories.service_repository),

    // Unit-Specialty use cases
    link_unit_specialty: new LinkUnitSpecialtyUseCase(
      repositories.unit_specialty_repository,
      repositories.specialty_repository,
      repositories.unit_repository,
    ),
    unlink_unit_specialty: new UnlinkUnitSpecialtyUseCase(repositories.unit_specialty_repository),
    get_unit_specialties: new GetUnitSpecialtiesUseCase(repositories.unit_specialty_repository),

    // Unit-Service use cases
    add_unit_service: new AddUnitServiceUseCase(
      repositories.unit_service_repository,
      repositories.service_repository,
      repositories.unit_repository,
    ),
    remove_unit_service: new RemoveUnitServiceUseCase(repositories.unit_service_repository),
    update_unit_service_config: new UpdateUnitServiceConfigUseCase(
      repositories.unit_service_repository,
    ),
    get_unit_services: new GetUnitServicesUseCase(repositories.unit_service_repository),

    // Storage use cases
    generate_upload_url: new GenerateUploadUrlUseCase(services.storage_gateway),
    generate_batch_upload_urls: new GenerateBatchUploadUrlsUseCase(services.storage_gateway),
    update_user_photo: new UpdateUserPhotoUseCase(
      repositories.user_repository,
      services.storage_gateway
    ),
    update_unit_logo: new UpdateUnitLogoUseCase(
      repositories.unit_repository,
      services.storage_gateway
    ),
    add_unit_gallery_photo: new AddUnitGalleryPhotoUseCase(
      repositories.unit_repository,
      services.storage_gateway
    ),
    add_batch_unit_gallery_photos: new AddBatchUnitGalleryPhotosUseCase(
      repositories.unit_repository,
      services.storage_gateway
    ),
    remove_unit_gallery_photo: new RemoveUnitGalleryPhotoUseCase(
      repositories.unit_repository,
      services.storage_gateway
    ),

    // Amenity use cases
    create_amenity: new CreateAmenityUseCase(repositories.amenity_repository),
    get_amenity_by_id: new GetAmenityByIdUseCase(repositories.amenity_repository),
    list_amenities: new ListAmenitiesUseCase(repositories.amenity_repository),
    search_amenities: new SearchAmenitiesUseCase(repositories.amenity_repository),
    update_amenity: new UpdateAmenityUseCase(repositories.amenity_repository),
    activate_amenity: new ActivateAmenityUseCase(repositories.amenity_repository),
    deactivate_amenity: new DeactivateAmenityUseCase(repositories.amenity_repository),

    // Unit-Amenity use cases
    link_unit_amenity: new LinkUnitAmenityUseCase(
      repositories.unit_amenity_repository,
      repositories.amenity_repository,
      repositories.unit_repository,
    ),
    unlink_unit_amenity: new UnlinkUnitAmenityUseCase(repositories.unit_amenity_repository),
    get_unit_amenities: new GetUnitAmenitiesUseCase(repositories.unit_amenity_repository),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
