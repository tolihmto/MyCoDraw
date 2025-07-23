export interface Server {
  id: string;
  name: string;
  description?: string;
  playerCount: number;
  status: 'active' | 'museum';
}
