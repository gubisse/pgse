import { component$, useSignal, $, useStore } from "@builder.io/qwik";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Componente principal
export const ListaProfessores = component$(() => {
  // Definição das colunas
  const colunas = ["ID", "Nome", "Email", "Telefone", "Endereço"];
  const colunasVisiveis = useSignal(new Set(colunas)); // Controle de visibilidade das colunas
  const colunaOrdenacao = useSignal<string | null>(null); // Coluna de ordenação
  const ordemAscendente = useSignal(true); // Ordenação ascendente/descendente
  const termoBusca = useSignal(""); // Termo de busca

  // Estado para armazenar linhas selecionadas
  const linhasSelecionadas = useStore<{ selecionados: number[] }>({ selecionados: [] });

  // Estado do modal de edição
  const modalAberto = useSignal(false);
  const professorEditando = useStore({ ID: '', Nome: '', Email: '', Telefone: '', Endereço: '' });

  // Dados de exemplo (professores)
  const dados = [
    { ID: 1, Nome: "João", Email: "joao@email.com", Telefone: "123456789", Endereço: "Rua A" },
    { ID: 2, Nome: "Maria", Email: "maria@email.com", Telefone: "987654321", Endereço: "Rua B" },
    { ID: 3, Nome: "Carlos", Email: "carlos@email.com", Telefone: "456123789", Endereço: "Rua C" },
  ];

  // Função para alternar visibilidade das colunas
  const toggleColuna = $((coluna: string) => {
    const novoSet = new Set(colunasVisiveis.value);
    novoSet.has(coluna) ? novoSet.delete(coluna) : novoSet.add(coluna);
    colunasVisiveis.value = new Set([...novoSet]);
  });

  // Função para ordenar os dados por uma coluna
  const ordenarPorColuna = $((coluna: string) => {
    if (colunaOrdenacao.value === coluna) {
      ordemAscendente.value = !ordemAscendente.value;
    } else {
      colunaOrdenacao.value = coluna;
      ordemAscendente.value = true;
    }
  });

  // Função para selecionar/deselecionar uma linha
  const toggleSelecionado = $((id: number) => {
    if (linhasSelecionadas.selecionados.includes(id)) {
      linhasSelecionadas.selecionados = linhasSelecionadas.selecionados.filter((item) => item !== id);
    } else {
      linhasSelecionadas.selecionados = [...linhasSelecionadas.selecionados, id];
    }
  });

  // Função para selecionar/deselecionar todas as linhas
  const selecionarTodasLinhas = $(() => {
    if (linhasSelecionadas.selecionados.length === dados.length) {
      linhasSelecionadas.selecionados = [];
    } else {
      linhasSelecionadas.selecionados = dados.map((linha) => linha.ID);
    }
  });

  // Filtragem dos dados conforme o termo de busca e colunas visíveis
  const dadosFiltrados = dados.filter((linha) =>
    Object.keys(linha).some((coluna) =>
      colunasVisiveis.value.has(coluna) &&
      linha[coluna].toString().toLowerCase().includes(termoBusca.value.toLowerCase())
    )
  );

  // Ordenação dos dados
  const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
    if (!colunaOrdenacao.value) return 0;
    const valorA = a[colunaOrdenacao.value];
    const valorB = b[colunaOrdenacao.value];

    return ordemAscendente.value ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });


  const novoProfessor = $(() => {

  });

  const importarDeXLSX = $(() => {

  });

  // Função para exportar para XLSX
  const exportarParaXLSX = $(() => {
    const linhasParaExportar = dadosOrdenados.filter((linha) =>
      linhasSelecionadas.selecionados.length === 0 || linhasSelecionadas.selecionados.includes(linha.ID)
    );

    const worksheet = XLSX.utils.json_to_sheet(linhasParaExportar.map(linha =>
      Object.fromEntries(colunas.filter(col => colunasVisiveis.value.has(col)).map(col => [col, linha[col]]))
    ));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Professores");
    XLSX.writeFile(workbook, "Professores.xlsx");
  });

  // Função para exportar para PDF
  const exportarParaPDF = $(() => {
    const doc = new jsPDF();
    const colunasAtuais = colunas.filter((coluna) => colunasVisiveis.value.has(coluna));
    const linhasParaExportar = dadosOrdenados.filter((linha) =>
      linhasSelecionadas.selecionados.length === 0 || linhasSelecionadas.selecionados.includes(linha.ID)
    );
    const linhas = linhasParaExportar.map((linha) => colunasAtuais.map((coluna) => linha[coluna]));

    doc.text("Lista de Professores", 10, 10);
    doc.autoTable({ head: [colunasAtuais], body: linhas, startY: 20 });
    doc.save("Professores.pdf");
  });

  // Função para abrir o modal de edição
  const editarProfessor = $(() => {
    if (linhasSelecionadas.selecionados.length === 1) {
      const professorSelecionado = dados.find((prof) => prof.ID === linhasSelecionadas.selecionados[0]);
      if (professorSelecionado) {
        Object.assign(professorEditando, professorSelecionado);
        modalAberto.value = true;
      }
    } else {
      alert("Selecione uma única linha para editar.");
    }
  });

  const salvarEdicao = $(() => {
    const professorIndex = dados.findIndex((professor) => professor.ID === professorEditando.ID);
    if (professorIndex !== -1) {
      dados[professorIndex] = { ...professorEditando };
      modalAberto.value = false; // Fecha o modal após salvar a edição
    }
  });

  return (
    <div class="container mt-4">
      <div class="row">
        {/* Seção para Gerenciar Colunas e Buscar */}
        <div class="col-md-10">
          <h5>Gerenciar Colunas</h5>
          <div class="mb-3 d-flex flex-wrap">
            {colunas.map((coluna) => (
              <div key={coluna} class="form-check me-3">
                <input
                  type="checkbox"
                  id={coluna}
                  class="form-check-input"
                  checked={colunasVisiveis.value.has(coluna)}
                  onChange$={() => toggleColuna(coluna)}
                />
                <label class="form-check-label" for={coluna}>
                  {coluna}
                </label>
              </div>
            ))}
          </div>

          <div class="mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar professor..."
              onInput$={(e) => (termoBusca.value = e.target.value)}
            />
          </div>

          {/* Tabela de Professores */}
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={linhasSelecionadas.selecionados.length === dados.length}
                      onChange$={selecionarTodasLinhas}
                    />
                  </th>
                  {colunas.filter((coluna) => colunasVisiveis.value.has(coluna)).map((coluna) => (
                    <th key={coluna} onClick$={() => ordenarPorColuna(coluna)} style={{ cursor: "pointer" }}>
                      {coluna} {colunaOrdenacao.value === coluna ? (ordemAscendente.value ? "⬆️" : "⬇️") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dadosOrdenados.map((linha, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={linhasSelecionadas.selecionados.includes(linha.ID)}
                        onChange$={() => toggleSelecionado(linha.ID)}
                      />
                    </td>
                    {colunas.filter((coluna) => colunasVisiveis.value.has(coluna)).map((coluna) => (
                      <td key={coluna}>{linha[coluna]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de Ações */}
        <div class="col-md-2">
          <h5>Ações</h5>
          <div class="g-3">
            <button class="btn btn-success mt-2 w-100" onClick$={novoProfessor}>Novo professor</button>
            <button class="btn btn-success mt-2 w-100" onClick$={importarDeXLSX}>Importar de XLSX</button>
            <button class="btn btn-success mt-2 w-100" onClick$={exportarParaXLSX}>Exportar para XLSX</button>
            <button class="btn btn-danger mt-2 w-100" onClick$={exportarParaPDF}>Exportar para PDF</button>
            <button class="btn btn-primary mt-2 w-100" onClick$={editarProfessor} disabled={linhasSelecionadas.selecionados.length !== 1}>
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Editar Professor */}
      {modalAberto.value && (
        <div class="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Editar Professor</h5>
                <button type="button" class="btn-close" onClick$={() => (modalAberto.value = false)}></button>
              </div>
              <div class="modal-body">
                {colunas.slice(1).map((coluna) => (
                  <input
                    key={coluna}
                    class="form-control mb-2"
                    value={professorEditando[coluna]}
                    onInput$={(e) => (professorEditando[coluna] = e.target.value)}
                  />
                ))}
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" onClick$={() => (modalAberto.value = false)}>Cancelar</button>
                <button class="btn btn-success" onClick$={salvarEdicao}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});
