import { component$ } from "@builder.io/qwik";
import { startIntro } from "../tour/intro";

export const TecnicoDistrital = component$(() => {


  return (
    <div class="card p-4">
      <h2>Cadastro Técnico Distrital</h2>
      <p>Formulário para cadastrar técnicos distritais.</p>

      <div class="container">
        <h2>Cadastro de Professor</h2>
        <button id="btn-cadastrar" class="btn btn-primary" onClick$={() => startIntro()}>
          Iniciar Tour
        </button>

        <form id="form-professor">
          <label>Nome:</label>
          <input type="text" />

          <label>Email:</label>
          <input type="email" />

          <label>Disciplina:</label>
          <input type="text" />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
      <div>
        <button id="botao-cadastro">Cadastro</button>
      </div>
    </div>

  );
});
