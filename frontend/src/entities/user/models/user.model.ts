export interface UserAvatar {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: UserAvatar;
  role: string;
  phone?: string;
  birthDate?: Date;
  createdAt: string;
  updatedAt: string;
}
