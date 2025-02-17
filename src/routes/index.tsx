import { component$, useSignal, $ } from "@builder.io/qwik";

import { PainelPrincipal } from "../components/painel-principal";

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
        Oi Ubisie como esta tsx
      </div>
      < PainelPrincipal painel="Quero painel Ubisse" />
    </div>
  );
});
