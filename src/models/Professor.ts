export interface Professor {
  id: string; // UUID
  name: string;
  schoolId: string; // Referência à School
}