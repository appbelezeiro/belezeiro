export interface OrganizationDTO {
  id: string;
  name: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrganizationSummaryDTO {
  id: string;
  name: string;
}
