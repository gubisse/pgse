import { component$, useSignal } from "@builder.io/qwik";
import { startIntro } from "./tour/intro";

import { ListaTecnicoDistrital } from "./lista-tecnico-distrital";
import { NovoTecnicoDistrital } from "./novo-tecnico-distrital";
import { ExportarTecnicoDistrital } from "./exportar-tecnico-distrital";
import { ImportarTecnicoDistrital } from "./importar-tecnico-distrital";


export const TecnicoDistrital = component$(() => {
  const componenteAtual = useSignal("tecnico"); // Controla o componente ativo


  return (
    <div class="card p-4">
      <div class="row border-bottom pb-2">
        <div class="col-md-3">
          <button class="btn btn-outline-primary w-100" onClick$={() => (componenteAtual.value = "ltd")}>Lista de Tecnicos Distritais</button>
        </div>
        <div class="col-md-3">
          <button class="btn btn-outline-primary w-100" onClick$={() => (componenteAtual.value = "ntd")}>Novo tecnico distrital</button>
        </div>
        <div class="col-md-3">
          <button class="btn btn-outline-primary w-100" onClick$={() => (componenteAtual.value = "etd")}>Exportar Tecnicos Distritais</button>          
        </div>
        <div class="col-md-3">
          <button class="btn btn-outline-primary w-100" onClick$={() => (componenteAtual.value = "itd")}>Importar Tecnicos Distritais</button>          
        </div>
      </div>

      {componenteAtual.value === "ltd" && <ListaTecnicoDistrital />}
      {componenteAtual.value === "ntd" && <NovoTecnicoDistrital />}
      {componenteAtual.value === "etd" && <ExportarTecnicoDistrital />}
      {componenteAtual.value === "itd" && <ImportarTecnicoDistrital />}
      
    </div>

  );
});
