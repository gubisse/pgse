export interface Estudante {
  id: string; // UUID
  schoolId: string; // Referência à School
  gender: 'H' | 'M'; // Sexo: Homem ou Mulher
  status: 'matriculado' | 'desistiu' | 'anulado'; // Situação do aluno
  year: number; // Ano da matrícula
}