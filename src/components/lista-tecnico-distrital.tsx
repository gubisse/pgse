import { component$ } from "@builder.io/qwik";
import { startIntro } from "./tour/intro";


export const ListaTecnicoDistrital = component$(() => {


  return (
    <div class="mt-3">
      <h5 class="text-uppercase">Lista de tecnicos distritais</h5>
      <div class="row">
        <div class="col-md-10">            
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Apelido</th>
                <th>Sexo</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="col-md-2">
          Outras acoes mais rapidas
        </div>
      </div>
    </div>
  );
});
