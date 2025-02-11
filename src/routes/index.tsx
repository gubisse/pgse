import { component$, useSignal, $ } from "@builder.io/qwik";
import { TecnicoDistrital } from "../components/cadastro-form/TecnicoDistrital";
import { CadastroDiretor } from "../components/cadastro-form/DiretorPedagogico";
import { CadastroDAP } from "../components/cadastro-form/DireAdjuPedag";
import { CadastroProfessor } from "../components/markdown/Cadastro-professor";
import { iniciarGuia } from "../components/tour/guia-index";

export default component$(() => {
  const componenteAtual = useSignal("tecnico"); // Controla o componente ativo
  const menuAberto = useSignal(false); // Controla o estado do menu (aberto ou fechado)

  // Função para alternar o estado do menu
  const alternarMenu = $(() => {
    menuAberto.value = !menuAberto.value;
  });

  const userName = "João Silva"; // Aqui você pode dinamicamente pegar o nome do usuário


  return (
    <div class="d-flex flex-column flex-md-row ">
      <div class="">
        {/* Logo no lado esquerdo */}
        

      </div>
      {/* MENU LATERAL */}
      <nav
        id="contentor-menu-apresentado"
        class={`bg-dark text-white p-3 vh-100 position-fixed top-0 start-0 ${menuAberto.value ? 'd-block' : 'd-none'} d-md-block`}
        style="width: 250px; z-index: 1050; transition: transform 0.3s ease-in-out;"
      >
        {/* Logo e Título */}
        <div class="d-flex align-items-center mb-3">
          <img 
            src="https://imagens.usp.br/wp-content/uploads/Campus-15-Foto-Marcos-Santos20101220_066-240x135.jpg" 
            alt="Logo" 
            class="me-2 rounded-circle" 
            style="width: 50px; height: 50px; object-fit: cover;"
          />
          <h5 class="mb-0">GSE</h5>
        </div>

        {/* Título do Menu */}
        <h5 class="text-center mb-3">Menu</h5>

        {/* Botões do Menu */}
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "tecnico")}>
          Cadastro Técnico Distrital
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "diretor")}>
          Cadastro Diretor
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "dap")}>
          Cadastro DAP
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "help-cadastro-professor")}>
          Ajuda Cadastro Professor
        </button>
        
        {/* Botão de Guia */}
        <button id="btn-iniciar-guia" class="btn btn-primary w-100 mt-3" onClick$={() => iniciarGuia()}>
          Iniciar Guia da Página
        </button>
      </nav>


      {/* BOTÃO PARA ABRIR MENU EM SMARTPHONE */}
      <button
        class="btn btn-primary d-md-none position-fixed"
        style="top: 10px; left: 10px; z-index: 1060;"
        onClick$={alternarMenu} // Usando o QRL aqui
      >
        {menuAberto.value ? "Fechar Menu" : "Abrir Menu"}
      </button>

      {/* CONTEÚDO PRINCIPAL */}
      <div id="contentor-conteudo-apresentado" class={`p-4 flex-grow-1 ms-250 ${menuAberto.value ? 'transition-all' : ''}`}>
        <div>
          <header class="bg-dark text-white d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center">
              <h4 class="mb-0">Bem-vindo, {userName}</h4>
            </div>
            
            <div class="d-flex">
              {/* Botão para Ações do Sistema */}
              <button class="btn btn-light me-3" onClick$={() => alert("Configurações do Sistema")}>
                Configurações
              </button>

              {/* Botão de Logout */}
              <button class="btn btn-danger" onClick$={() => alert("Saindo...")}>
                Sair
              </button>
            </div>
          </header>
        </div>
        {componenteAtual.value === "tecnico" && <TecnicoDistrital />}
        {componenteAtual.value === "diretor" && <CadastroDiretor />}
        {componenteAtual.value === "dap" && <CadastroDAP />}
        {componenteAtual.value === "help-cadastro-professor" && <CadastroProfessor />}
      </div>

    </div>
  );
});
