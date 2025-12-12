// ============================================================================
// ONBOARDING SERVICE - API Integration Layer
// ============================================================================

import { privateClient } from '@/services/api/client';
import { uploadService } from '@/features/upload/api/upload.service';
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
   * Creates organization first, then creates unit
   */
  async submitOnboarding(data: OnboardingSubmitData, userId: string): Promise<OnboardingResult> {
    // Step 1: Create organization (backend will mark onboarding complete if first business)
    const organization = await this.createOrganization({
      businessName: data.businessName,
      ownerId: userId,
    });

    // Step 2: Create unit (without images - they will be uploaded separately)
    const unit = await this.createUnit({
      organizationId: organization.id,
      name: data.unitName,
      brandColor: data.brandColor,
      subscription: {
        plan: 'free',
        status: 'active',
      },
      // Don't send logo/gallery - will be uploaded after unit creation
      whatsapp: data.whatsapp,
      phone: data.phone,
      address: data.address,
      especialidades: data.especialidades,
      services: data.services,
      serviceType: data.serviceType,
      amenities: data.amenities,
      // Availability rules
      availability_rules: data.availability_rules,
      availability_exceptions: data.availability_exceptions,
    });

    // Step 3: Link specialties to unit
    try {
      const specialtyPromises = data.especialidades
        .filter((espec) => espec.id && !espec.id.startsWith('custom-'))
        .map(async (espec) => {
          try {
            await privateClient.post(`/api/units/${unit.id}/specialties`, {
              specialty_id: espec.id,
            });
          } catch (error) {
            console.warn(`Failed to link specialty ${espec.id}:`, error);
          }
        });

      await Promise.allSettled(specialtyPromises);
    } catch (error) {
      console.warn('Error linking specialties:', error);
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
