export interface OrganizationDTO {
  id: string;
  businessName: string;
  brandColor: string;
  ownerId: string;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended';
    expiresAt?: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export interface OrganizationSummaryDTO {
  id: string;
  businessName: string;
  brandColor: string;
}
