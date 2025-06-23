// src/models/user.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

// DTO para criação/edição (sem _id)
export interface UserCreateDTO {
  username: string;
  email: string;
  role: string;
}
