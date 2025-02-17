import { component$, useSignal, $ } from "@builder.io/qwik";

import { PainelPrincipal } from "../components/painel-principal";
import { Dash } from "../components/dash";

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
          <img  width="100" height="100" 
            src="https://imagens.usp.br/wp-content/uploads/Campus-15-Foto-Marcos-Santos20101220_066-240x135.jpg" 
            alt="Logo" 
            class="me-2 rounded-circle" 
            style="width: 50px; height: 50px; object-fit: cover;"
          ></img>
          <h5 class="mb-0">GSE</h5>
        </div>

        {/* Título do Menu */}
        <h5 class="text-center mb-3">Menu</h5>

        {/* Botões do Menu */}
        {/* Nao esta em funcinamento 
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "tecnico")}>
          Técnico Distrital
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "director")}>
          Diretor Escolar
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "dap")}>
          Director Adjunto Pedagogico
        </button>
        <button class="btn btn-light w-100 mb-2" onClick$={() => (componenteAtual.value = "help-cadastro-professor")}>
          Ajuda Cadastro Professor
        </button>
        */}
        <p>Este menu foi retirado devido a sua inutilidade, a permissao do usuario ee que determinam o que o deve ser exibido para usuario, para melhorar UX deve ser muito simples, podes olhar para o lado dreito, tem o painel de ACOESS do usuario, para os acessar va para o arquivo painel-principal.tsx que estaa em componets </p>

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
          <header class="bg-dark text-white d-flex flex-wrap justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center flex-grow-1">
              <h4 class="mb-0 text-truncate">Bem-vindo, {userName}</h4>
            </div>
            
            <div class="d-flex gap-2">
              <button class="btn btn-light me-2" onClick$={() => alert("Configurações do Sistema")}>
                Configurações
              </button>
              <button class="btn btn-danger" onClick$={() => alert("Saindo...")}>
                Sair
              </button>
            </div>
          </header>

        </div>

      {["tecnico", "director", "dap"].includes(componenteAtual.value) && (<PainelPrincipal painel={componenteAtual.value} /> )}
      {componenteAtual.value === "help-cadastro-professor" && <CadastroProfessor />}
      </div>

    </div>
  );
});
