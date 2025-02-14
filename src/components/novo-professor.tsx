import { component$, useVisibleTask$ } from "@builder.io/qwik";

export const NovoProfessor = component$(() => {

  useVisibleTask$(() => {
    const populateYearSelect = (id: string) => {
      const select = document.getElementById(id) as HTMLSelectElement;
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 1960; year--) {
        const option = document.createElement("option");
        option.value = year.toString();
        option.textContent = year.toString();
        select.appendChild(option);
      }
    };

    populateYearSelect("anoFormacao");
    populateYearSelect("anoConclusaoDeNivel");
    populateYearSelect("anoAdmissaoAparelhoEstado");
  });

  return (
    <div class="mt-3">
      <h5 class="text-uppercase">Novo Professor no sistema</h5>
      <div class="row">
        <div class="col-md-10">
          <form>
            <div class="row g-2">
              <div class="col-md-4 form-floating d-none">
                <input type="text" class="form-control" id="id" placeholder="" />
                <label htmlFor="id">Identificador</label>
              </div>

              <div class="col-md-4 form-floating">
                <input type="text" class="form-control" id="nome" placeholder="André Musandibvunze" />
                <label htmlFor="nome">Nome</label>
              </div>

              <div class="col-md-4 form-floating">
                <input type="text" class="form-control" id="apelido" placeholder="Digite o apelido" />
                <label htmlFor="apelido">Apelido</label>
              </div>

              <div class="col-md-4 form-floating">
                <select class="form-select" id="sexo">
                  <option value="" selected disabled>Selecione...</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
                <label htmlFor="sexo">Sexo</label>
              </div>

              <div class="col-md-4 form-floating">
                <select class="form-control" id="anoFormacao">
                  <option value="" selected disabled>Selecione o ano</option>
                </select>
                <label htmlFor="anoFormacao">Ano de Formação</label>
              </div>

              <div class="col-md-4 form-floating">
                <select class="form-control" id="anoConclusaoDeNivel">
                  <option value="" selected disabled>Selecione o ano</option>
                </select>
                <label htmlFor="anoConclusaoDeNivel">Ano Conclusão De Nível</label>
              </div>

              <div class="col-md-4 form-floating">
                <input type="text" class="form-control" id="localConclusaoDeNivel" placeholder="Digite o local" />
                <label htmlFor="localConclusaoDeNivel">Local Conclusão De Nível</label>
              </div>

              <div class="col-md-4 form-floating">
                <select class="form-control" id="anoAdmissaoAparelhoEstado">
                  <option value="" selected disabled>Selecione o ano</option>
                </select>
                <label htmlFor="anoAdmissaoAparelhoEstado">Ano Admissão no Aparelho de Estado</label>
              </div>

              <div class="col-md-4 form-floating">
                <input type="tel" class="form-control" id="contacto" placeholder="Digite o contacto" pattern="\d{9}" maxLength={9} />
                <label htmlFor="contacto">Contacto</label>
              </div>

              <div class="col-md-4 form-floating">
                <input type="text" class="form-control" id="escolaOndeLeciona" placeholder="Digite a escola" />
                <label htmlFor="escolaOndeLeciona">Escola onde Leciona</label>
              </div>

            </div>
            <div class="d-flex justify-content-end mt-3">
              <input type="submit" class="btn btn-success" value="Submeter" />
            </div>

          </form>
        </div>
        <div class="col-md-2">
          <h5 class="text-uppercase">Informacao</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <button class="btn btn-primary">Guia automatica</button>
        </div>
      </div>
    </div>
  );
});
