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

/**
 * User data for auth responses (login, /me endpoint)
 * Format matches frontend User type expectations
 */
export interface UserAuthDTO {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isActive: boolean;
  onboardingCompleted: boolean;
}
