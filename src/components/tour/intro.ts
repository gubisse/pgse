import { component$ } from '@builder.io/qwik';
import introJs from 'intro.js'; // Importando a biblioteca

export const startIntro = () => {
  introJs().setOptions({
    steps: [
      {
        element: '#btn-intro-init',
        intro: "Bem-vindo ao sistema! Aqui você pode explorar as funcionalidades.",
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight',
      },
      {
        element: '#botao-cadastro',
        intro: "Este botão permite cadastrar um novo professor.",
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight',
        arrowOffset: 50,
      },
      {
        element: '#form-professor',
        intro: "Aqui você preenche as informações do professor.",
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight',
      },
      {
        intro: "Este foi o tour! Boa sorte!",
        buttons: [
          {
            text: 'Concluir',
            action: () => { 
              introJs().exit(); // Finaliza o tour quando clicar em "Concluir"
            },
            classes: 'btn btn-success',  // Estilo do botão
          },
        ],
      }
    ],
    showButtons: true,
    showStepNumbers: true,
    exitOnEsc: false,  // Desabilita a tecla ESC
    overlayOpacity: 0.8,
    nextLabel: 'Próximo →',
    prevLabel: '← Anterior',
    //skipLabel: 'Pular',
    hidePrev: true, // Oculta o botão "Anterior"
    hideNext: true, // Oculta o botão "Próximo" após o último passo
    overlayClick: false,  // Impede que o usuário saia clicando fora do tour
  }).start();
};

