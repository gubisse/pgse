import { component$ } from '@builder.io/qwik';
import introJs from 'intro.js'; // Importando a biblioteca

export const iniciarGuia = () => {
  introJs().setOptions({
    steps: [
      {
        element: '#contentor-menu-apresentado',
        intro: "Menu principal deste sistema, onde é apresentado as acoes para o usuario.",
        tooltipClass: 'custom-tooltip',
        highlightClass: 'custom-highlight',
        arrowOffset: 50,
      },
      {
        element: '#contentor-conteudo-apresentado',
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
        ]
      }
    ],
    // O botão de conclusão será exibido no último passo
    showButtons: true,
    showStepNumbers: true,
    exitOnEsc: false,  // Desabilita a tecla ESC
    overlayOpacity: 0.8,
    nextLabel: 'Próximo →',
    prevLabel: '← Anterior',
    hidePrev: true, // Oculta o botão "Anterior"
    hideNext: true, // Oculta o botão "Próximo" após o último passo
    overlayClick: false,  // Impede que o usuário saia clicando fora do tour
    doneLabel: 'Concluir',  // Modificar o texto do botão para "Concluir"
  }).start();
};

