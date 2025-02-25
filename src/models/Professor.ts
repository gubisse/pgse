import { useStore, $ } from "@builder.io/qwik";

// Função para gerenciar os professores
export const useProfessoresStore = () => {
  const professores = useStore([
    { ID: 1, Nome: "João", Email: "joao@email.com", Telefone: "123456789", Endereço: "Rua A" },
    { ID: 2, Nome: "Maria", Email: "maria@email.com", Telefone: "987654321", Endereço: "Rua B" },
  ]);

  // Função para excluir um professor
  const excluirProfessor = $((id: number) => {
    const index = professores.findIndex((prof) => prof.ID === id);
    if (index !== -1) {
      professores.splice(index, 1);
    }
  });

  // Função para adicionar um novo professor, agora usando $ para serialização
  const adicionarProfessor = $((professor: { ID: string, Nome: string, Email: string, Telefone: string, Endereço: string }) => {
    professores.push(professor);
  });

  const atualizarProfessor = $((professor: { ID: string, Nome: string, Email: string, Telefone: string, Endereço: string }) => {
    professores.push(professor);
  });

  return {
    professores,
    adicionarProfessor,
    atualizarProfessor,
    excluirProfessor,
  };
};
