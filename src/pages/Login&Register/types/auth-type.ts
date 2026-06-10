export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  email: string;
  password: string;
  phone_number?: string;
  username?: string;
  role?: string;
}