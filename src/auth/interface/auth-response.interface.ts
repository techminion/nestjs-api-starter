export interface AuthResponse {
  userId: string;
  email: string;
  token: string;
  refreshToken?: string;
}
