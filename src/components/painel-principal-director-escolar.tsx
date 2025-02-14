import { component$, useSignal, $, useStore, noSerialize  } from "@builder.io/qwik";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as ODS from "ods"; // Supondo que você tenha uma biblioteca para ler arquivos ODS


// Componente principal
export const DirectorEscolar = component$(() => {


  const modalImportarXLSXAberto = useSignal(false);
  const arquivoAImportarSelecionado =  useSignal<File | null>(null);  // Use useSignal para o valor inicial
  const numeroDeColunasNoArquivoAImportarSelecionado = useSignal<number | null>(null);

  const componenteAtual = useSignal(""); // Controla o componente ativo

  // Definição das colunas
  const colunas = ["ID", "Nome", "Email", "Telefone", "Endereço"];
  const colunasVisiveis = useSignal(new Set(colunas)); // Controle de visibilidade das colunas
  const colunaOrdenacao = useSignal<string | null>(null); // Coluna de ordenação
  const ordemAscendente = useSignal(true); // Ordenação ascendente/descendente
  const termoBusca = useSignal(""); // Termo de busca

  // Estado para armazenar linhas selecionadas
  const linhasSelecionadas = useStore<{ selecionados: number[] }>({ selecionados: [] });

  // Estado do modal de edição
  const modalEditarProfessorAberto = useSignal(false);
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
    componenteAtual.value = "np"
  });





  const abrirModalImportarXLSX = $(() => {
    modalImportarXLSXAberto.value = true;
    componenteAtual.value = "ip"
  });

  const fecharModalImportarXLSX = $(() => {
    modalImportarXLSXAberto.value = false;
    arquivoAImportarSelecionado.value = null;
    componenteAtual.value = ""
  });

  const importarDeXLSX = $(() => {
    if (!arquivoAImportarSelecionado.value) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        alert("Erro ao ler o arquivo.");
        return;
      }

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const ext = arquivoAImportarSelecionado.value.name.split(".").pop()?.toLowerCase();

      try {
        if (ext === "xlsx" || ext === "ods") {
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(ws);
          console.log(jsonData); // Processar os dados conforme necessário
        } else {
          alert("Tipo de arquivo não suportado. Carregue um arquivo XLSX ou ODS.");
        }
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        alert("Erro ao processar o arquivo. Verifique se está no formato correto.");
      }
    };

    reader.readAsArrayBuffer(arquivoAImportarSelecionado.value);
  });

  // Função para exportar para XLSX
  const exportarParaXLSX = $(() => {
    componenteAtual.value = "epx"
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
    componenteAtual.value = "epp"
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
    componenteAtual.value = "ep"
    if (linhasSelecionadas.selecionados.length === 1) {
      const professorSelecionado = dados.find((prof) => prof.ID === linhasSelecionadas.selecionados[0]);
      if (professorSelecionado) {
        Object.assign(professorEditando, professorSelecionado);
        modalEditarProfessorAberto.value = true;
      }
    } else {
      alert("Selecione uma única linha para editar.");
    }
  });

  const salvarEdicao = $(() => {
    const professorIndex = dados.findIndex((professor) => professor.ID === professorEditando.ID);
    if (professorIndex !== -1) {
      dados[professorIndex] = { ...professorEditando };
      modalEditarProfessorAberto.value = false; // Fecha o modal após salvar a edição
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
            
            <button className={`btn  mt-2 w-100 ${componenteAtual.value === "np" ? "btn-success" : "btn-outline-primary"}`} onClick$={novoProfessor}>Novo professor</button>
            <button className={`btn  mt-2 w-100 ${componenteAtual.value === "ip" ? "btn-success" : "btn-outline-primary"}`} onClick$={abrirModalImportarXLSX}>Importar de XLSX</button>
            <button className={`btn  mt-2 w-100 ${componenteAtual.value === "epx" ? "btn-success" : "btn-outline-primary"}`} onClick$={exportarParaXLSX}>Exportar para XLSX</button>
            <button className={`btn  mt-2 w-100 ${componenteAtual.value === "epp" ? "btn-success" : "btn-outline-primary"}`} onClick$={exportarParaPDF}>Exportar para PDF</button>
            <button className={`btn  mt-2 w-100 ${componenteAtual.value === "ep" ? "btn-success" : "btn-outline-primary"}`} onClick$={editarProfessor} disabled={linhasSelecionadas.selecionados.length !== 1}>Editar</button>

          </div>
        </div>
      </div>

      {/* Modal para Editar Professor */}
      {modalEditarProfessorAberto.value && (
        <div class="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Editar Professor</h5>
                <button type="button" class="btn-close" onClick$={() => (modalEditarProfessorAberto.value = false)}></button>
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
                <button class="btn btn-secondary" onClick$={() => (modalEditarProfessorAberto.value = false)}>Cancelar</button>
                <button class="btn btn-success" onClick$={salvarEdicao}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalImportarXLSXAberto.value && (
  <div class="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Importar Arquivo</h5>
          <button type="button" class="btn-close" onClick$={fecharModalImportarXLSX}></button>
        </div>
        <div class="modal-body">
          <input
            type="file"
            class="form-control"
            accept=".xlsx, .ods"
            onChange$={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0] || null;
              arquivoAImportarSelecionado.value = noSerialize(file); // Impede a serialização do objeto File
            }}
          />

          <p class="text-muted">Selecione um arquivo XLSX ou ODS para importar.</p>

          {arquivoAImportarSelecionado.value && (
            <div>
              <p class="text-success">Arquivo selecionado: {arquivoAImportarSelecionado.value.name}</p>
              {numeroDeColunasNoArquivoAImportarSelecionado.value !== null && (
                <p class="text-info">Número de colunas: {numeroDeColunasNoArquivoAImportarSelecionado.value}</p>
              )}
            </div>
          )}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onClick$={fecharModalImportarXLSX}>
            Cancelar
          </button>
          <button
            class="btn btn-success"
            onClick$={importarDeXLSX}
            disabled={!arquivoAImportarSelecionado.value}
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
});
