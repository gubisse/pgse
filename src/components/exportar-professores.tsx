import { component$ } from "@builder.io/qwik";
import { startIntro } from "./tour/intro";


export const ExportarProfessores = component$(() => {


  return (
    <div class="mt-3">
      <h5 class="text-uppercase">Expor professor</h5>
      <div class="row">
        <div class="col-md-10">            
          <form>
            <div class="row">
              <div class="col-md-4 form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
                <label for="floatingInput">Nome</label>
              </div>
              <div class="col-md-4 form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" />
                <label for="floatingPassword">Apelido</label>
              </div>
              <div class="col-md-4 form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" />
                <label for="floatingPassword">Sexo</label>
              </div>
            </div>
          </form>
        </div>
        <div class="col-md-2">
          sas
        </div>
      </div>
    </div>
  );
});
