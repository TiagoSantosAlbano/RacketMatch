// src/models/match.ts

export interface Match {
  _id?: string;  // ID gerado pelo MongoDB
  court_id: string;  // ID da campo associada
  players: string[];  // array de IDs dos jogadores
  match_date: string;  // data no formato ISO: 'YYYY-MM-DD'
  match_time: string;  // hora no formato: 'HH:mm'
  status: 'Scheduled' | 'Completed' | 'Cancelled';  // estados da partida
  createdAt?: string;
  updatedAt?: string;
}

// DTO para criar uma partida (sem _id, status e timestamps, pois são gerados no backend)
export interface MatchCreateDTO {
  court_id: string;
  players: string[];
  match_date: string;
  match_time: string;
}
