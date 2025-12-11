export interface OrganizationDTO {
  id: string;
  businessName: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrganizationSummaryDTO {
  id: string;
  businessName: string;
}
