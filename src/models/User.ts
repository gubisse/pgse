export interface Usuario {
  id: string; // UUID
  name: string;
  email: string;
  password?: string; // Opcional, pode ser usado só no backend ou simulação
  role: 'provincial' | 'distrital' | 'diretor' | 'adjunto';
}