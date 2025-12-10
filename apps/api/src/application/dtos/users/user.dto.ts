export interface UserDTO {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  created_at: Date;
}

export interface UserProfileDTO {
  email: string;
  name: string;
  photoUrl?: string;
}
