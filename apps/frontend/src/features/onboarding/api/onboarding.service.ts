// ============================================================================
// ONBOARDING SERVICE - API Integration Layer
// ============================================================================

import { privateClient } from '@/services/api/client';
import type {
  CreateOrganizationRequest,
  OrganizationDTO,
  CreateUnitRequest,
  UnitDTO,
  UnitListResponse,
  OnboardingSubmitData,
  OnboardingResult,
} from '../types';

/**
 * Onboarding Service
 * Handles all onboarding-related API calls
 */
class OnboardingService {
  // ============================================================================
  // Organization endpoints
  // ============================================================================

  /**
   * Create a new organization
   * Endpoint: POST /api/organizations
   */
  async createOrganization(data: CreateOrganizationRequest): Promise<OrganizationDTO> {
    const response = await privateClient.post<OrganizationDTO>('/api/organizations', data);
    return response.data;
  }

  /**
   * Get organization by owner ID
   * Endpoint: GET /api/organizations/owner/:ownerId
   */
  async getOrganizationByOwner(ownerId: string): Promise<OrganizationDTO | null> {
    try {
      const response = await privateClient.get<OrganizationDTO>(
        `/api/organizations/owner/${ownerId}`
      );
      return response.data;
    } catch (error: unknown) {
      // 404 means organization doesn't exist
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * Get organization by ID
   * Endpoint: GET /api/organizations/:id
   */
  async getOrganizationById(id: string): Promise<OrganizationDTO> {
    const response = await privateClient.get<OrganizationDTO>(`/api/organizations/${id}`);
    return response.data;
  }

  // ============================================================================
  // Unit endpoints
  // ============================================================================

  /**
   * Create a new unit
   * Endpoint: POST /api/units
   */
  async createUnit(data: CreateUnitRequest): Promise<UnitDTO> {
    const response = await privateClient.post<UnitDTO>('/api/units', data);
    return response.data;
  }

  /**
   * Get unit by ID
   * Endpoint: GET /api/units/:id
   */
  async getUnitById(id: string): Promise<UnitDTO> {
    const response = await privateClient.get<UnitDTO>(`/api/units/${id}`);
    return response.data;
  }

  /**
   * Get units by organization ID
   * Endpoint: GET /api/units/organization/:organizationId
   */
  async getUnitsByOrganization(organizationId: string): Promise<UnitListResponse> {
    const response = await privateClient.get<UnitListResponse>(
      `/api/units/organization/${organizationId}`
    );
    return response.data;
  }

  // ============================================================================
  // Complete onboarding flow
  // ============================================================================

  /**
   * Submit complete onboarding data
   * Creates organization first, then creates unit, then links specialties and services
   */
  async submitOnboarding(data: OnboardingSubmitData, userId: string): Promise<OnboardingResult> {
    // Step 1: Create organization
    const organization = await this.createOrganization({
      businessName: data.businessName,
      brandColor: data.brandColor,
      ownerId: userId,
      subscription: {
        plan: 'free',
        status: 'active',
      },
    });

    // Step 2: Create unit (with professions/services for backward compatibility)
    // Note: These will be migrated to the new specialty/service system below
    const unit = await this.createUnit({
      organizationId: organization.id,
      name: data.unitName,
      logo: data.logo,
      gallery: data.gallery,
      whatsapp: data.whatsapp,
      phone: data.phone,
      address: data.address,
      professions: data.professions,
      services: data.services,
      serviceType: data.serviceType,
      amenities: data.amenities,
      // Availability is now defined through availability_rules and availability_exceptions
      availability_rules: data.availability_rules,
      availability_exceptions: data.availability_exceptions,
    });

    // Step 3: Link specialties to unit (new API)
    // Only link if specialty has a valid ID (not custom)
    try {
      const specialtyPromises = data.professions
        .filter((prof) => prof.id && !prof.id.startsWith('custom-'))
        .map(async (prof) => {
          try {
            await privateClient.post(`/api/units/${unit.id}/specialties`, {
              specialty_id: prof.id,
            });
          } catch (error) {
            console.warn(`Failed to link specialty ${prof.id}:`, error);
            // Continue with other specialties even if one fails
          }
        });

      await Promise.allSettled(specialtyPromises);
    } catch (error) {
      console.warn('Error linking specialties:', error);
      // Don't fail onboarding if specialty linking fails
    }

    // Step 4: Link services to unit (new API)
    // Map services by finding their IDs in the specialties
    try {
      // For now, we skip automatic service linking as we don't have service IDs
      // This will be handled in a future update when we store service IDs in the form
      console.log('Service linking will be available in next update');
    } catch (error) {
      console.warn('Error linking services:', error);
      // Don't fail onboarding if service linking fails
    }

    return { organization, unit };
  }

  // ============================================================================
  // Onboarding status check
  // ============================================================================

  /**
   * Check if user has completed onboarding
   * Returns organization and units if exists
   */
  async checkOnboardingStatus(userId: string): Promise<{
    hasOrganization: boolean;
    hasUnit: boolean;
    organization: OrganizationDTO | null;
    units: UnitDTO[];
  }> {
    const organization = await this.getOrganizationByOwner(userId);

    if (!organization) {
      return {
        hasOrganization: false,
        hasUnit: false,
        organization: null,
        units: [],
      };
    }

    const unitsResponse = await this.getUnitsByOrganization(organization.id);

    return {
      hasOrganization: true,
      hasUnit: unitsResponse.total > 0,
      organization,
      units: unitsResponse.items,
    };
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();
export default onboardingService;
