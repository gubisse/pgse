import Shepherd from "shepherd.js";

export const startTour = () => {
  // Criação do tour com Shepherd.js
  const tour = new Shepherd.Tour({
    useModalOverlay: true, // Ativa o overlay no fundo
    defaultStepOptions: {
      classes: "shadow-lg bg-info text-white rounded p-3", // Estilo básico dos passos
      scrollTo: true, // Faz o scroll até o elemento
      showCancelLink: true, // Mostra link de cancelamento
      cancelIcon: {
        enabled: true,
        name: "fa fa-times-circle", // Ícone de cancelamento
      },
      modalOverlayClass: "shepherd-modal-overlay", // Classe para controlar o estilo do overlay
    },
  });

  // Passo 1: Botão de cadastro
  tour.addStep({
    title: "👋 Bem-vindo!",
    text: "Aqui você pode cadastrar um novo professor. Vamos começar o tour?",
    attachTo: { element: "#btn-cadastrar", on: "bottom" }, // Posiciona a seta abaixo do botão
    buttons: [
      {
        text: "Próximo",
        action: tour.next,
        classes: "btn btn-primary", // Estilo do botão
      },
    ],
    highlightClass: "highlight", // Aplica uma classe de destaque ao botão
    arrowOffset: 10, // Ajuste para a posição da seta
  });

  // Passo 2: Formulário de cadastro
  tour.addStep({
    title: "📋 Preencha os Dados",
    text: "Agora, vamos preencher as informações do professor. Preencha os campos abaixo.",
    attachTo: { element: "#form-professor", on: "top" }, // Posiciona a seta acima do formulário
    buttons: [
      {
        text: "Voltar",
        action: tour.back,
        classes: "btn btn-secondary", // Estilo do botão
      },
      {
        text: "Concluir",
        action: tour.complete,
        classes: "btn btn-success", // Estilo do botão
      },
    ],
    highlightClass: "highlight", // Aplica uma classe de destaque ao formulário
    arrowOffset: 50, // Ajuste para a posição da seta
  });

  // Inicia o tour
  tour.start();
};
