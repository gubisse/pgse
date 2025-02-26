export interface Escola {
  id: string; // UUID
  name: string;
  district: string;
  directorId: string; // Referência ao User (Diretor)
  districtTechId: string; // Referência ao User (Técnico Distrital)
}