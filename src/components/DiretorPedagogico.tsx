import { component$ } from "@builder.io/qwik";
import { startTour } from "./tour/cadastro-professor";

export const CadastroDiretor = component$(() => {
  return (
    <div class="card p-4">
      <h2>Cadastro de Diretor</h2>
      <p>Formulário para cadastrar diretores de escola.</p>
    </div>
  );
});
