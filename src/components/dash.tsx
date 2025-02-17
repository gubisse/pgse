{/*
Beleza, vamos trabalhar no Módulo 2: Tela Principal (Dashboard).

Estrutura do Dashboard
A tela principal será personalizada conforme o perfil do usuário logado e conterá:

Menu Lateral (fixo no canto esquerdo)

Configurações
Sobre o Usuário
Sair
Área de Ações (lado direito)

Disponibiliza botões conforme permissões do perfil logado.
Exemplo: Cadastro de professores, técnicos, diretores, escolas, etc.
Vou estruturar o código base no Qwik. Segura aí! 🚀

*/}
import { component$, useStore } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const navigate = useNavigate();
  const state = useStore({
    userRole: 'tecnicoDistrital', // Simulando um perfil logado
  });

  return (
    <div class="flex h-screen">
      {/* Menu Lateral */}
      <aside class="w-64 bg-gray-800 text-white p-4">
        <h2 class="text-lg font-bold">PGSE.EDU.MZ</h2>
        <ul class="mt-4">
          <li class="py-2 px-3 hover:bg-gray-700 cursor-pointer">Configurações</li>
          <li class="py-2 px-3 hover:bg-gray-700 cursor-pointer">Sobre o Usuário</li>
          <li class="py-2 px-3 hover:bg-red-600 cursor-pointer">Sair</li>
        </ul>
      </aside>
      
      {/* Conteúdo Principal */}
      <div class="flex-1 p-6 bg-gray-100">
        <h2 class="text-2xl font-semibold">Dashboard</h2>
        <div class="mt-4 grid grid-cols-2 gap-4">
          {/* Exemplo de Ações conforme perfil */}
          {state.userRole === 'tecnicoDistrital' && (
            <button class="p-4 bg-blue-500 text-white rounded shadow">Novo Professor</button>
          )}
          {state.userRole === 'tecnicoProvincial' && (
            <button class="p-4 bg-green-500 text-white rounded shadow">Novo Técnico Distrital</button>
          )}
          <button class="p-4 bg-purple-500 text-white rounded shadow">Listar Escolas</button>
        </div>
      </div>
    </div>
  );
});
