import { component$, useSignal, $, useStore, noSerialize  } from "@builder.io/qwik";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { jsPDF } from "jspdf";
import "jspdf-autotable";  // Importa o plugin autoTable

import * as ODS from "ods"; // Supondo que você tenha uma biblioteca para ler arquivos ODS


// Componente principal
export const PainelPrincipal = component$(({painel}) => {

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
  const modalCadastroProfessorAberto = useSignal(false);
  const professorEditando = useStore({ ID: '', Nome: '', Email: '', Telefone: '', Endereço: '' });

  const dadosProfessores = [
    { ID: 1, Nome: "João", Email: "joao@email.com", Telefone: "123456789", Endereço: "Rua A", Perfil: { nivel: "Tecnico provincial", estado: "N1" } },
    { ID: 2, Nome: "Maria", Email: "maria@email.com", Telefone: "987654321", Endereço: "Rua B", perfil: { nivel: "Director", estado: "N1" } },
    { ID: 3, Nome: "Carlos", Email: "carlos@email.com", Telefone: "456123789", Endereço: "Rua C", perfil: { nivel: "Tecnico distrital", estado: "N1" } },
    { ID: 4, Nome: "Ana", Email: "ana@email.com", Telefone: "321654987", Endereço: "Rua D", perfil: { nivel: null, estado: "N1" } },
    { ID: 5, Nome: "Pedro", Email: "pedro@email.com", Telefone: "123654789", Endereço: "Rua E", perfil: { nivel: "Tecnico provincial", estado: "N1" } },
    { ID: 6, Nome: "Juliana", Email: "juliana@email.com", Telefone: "987321654", Endereço: "Rua F", perfil: { nivel: "Director", estado: "N1" } },
    { ID: 7, Nome: "Roberto", Email: "roberto@email.com", Telefone: "456987123", Endereço: "Rua G", perfil: { nivel: "Tecnico distrital", estado: "N2" } },
    { ID: 8, Nome: "Cláudia", Email: "claudia@email.com", Telefone: "321987654", Endereço: "Rua H", perfil: { nivel: null, estado: "N2" } },
    { ID: 9, Nome: "Ricardo", Email: "ricardo@email.com", Telefone: "654321987", Endereço: "Rua I", perfil: { nivel: "Tecnico provincial", estado: "N1" } },
    { ID: 10, Nome: "Beatriz", Email: "beatriz@email.com", Telefone: "987654123", Endereço: "Rua J", perfil: { nivel: "Director", estado: "N2" } },
    { ID: 11, Nome: "Simone", Email: "simone@email.com", Telefone: "123789654", Endereço: "Rua K", perfil: { nivel: "Tecnico distrital", estado: "N1" } },
    { ID: 12, Nome: "Felipe", Email: "felipe@email.com", Telefone: "987123456", Endereço: "Rua L", perfil: { nivel: "Tecnico provincial", estado: "N2" } },
    { ID: 13, Nome: "Camila", Email: "camila@email.com", Telefone: "456321654", Endereço: "Rua M", perfil: { nivel: "Director", estado: "N1" } },
    { ID: 14, Nome: "Sandro", Email: "sandro@email.com", Telefone: "321456987", Endereço: "Rua N", perfil: { nivel: "Tecnico distrital", estado: "N1" } },
    { ID: 15, Nome: "Patrícia", Email: "patricia@email.com", Telefone: "654123987", Endereço: "Rua O", perfil: { nivel: null, estado: "N2" } },
    { ID: 16, Nome: "Luciano", Email: "luciano@email.com", Telefone: "987654321", Endereço: "Rua P", perfil: { nivel: "Tecnico provincial", estado: "N2" } }
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
    if (linhasSelecionadas.selecionados.length === dadosProfessores.length) {
      linhasSelecionadas.selecionados = [];
    } else {
      linhasSelecionadas.selecionados = dadosProfessores.map((linha) => linha.ID);
    }
  });

  // Filtragem dos dados conforme o termo de busca e colunas visíveis
  const dadosFiltrados = dadosProfessores.filter((linha) =>
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


  //Abrir modal



  const abrirModalImportarXLSX = $(() => {
    modalImportarXLSXAberto.value = true;
    componenteAtual.value = "ip"
  });

  // Fechar madal

  const fecharModalImportarXLSX = $(() => {
    modalImportarXLSXAberto.value = false;
    arquivoAImportarSelecionado.value = null;
    componenteAtual.value = ""
  });

  const fecharModalCProfessor = $(() => {
    modalCadastroProfessorAberto.value = false;
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





  const salvarEdicao = $(() => {
    const professorIndex = dadosProfessores.findIndex((professor) => professor.ID === professorEditando.ID);
    if (professorIndex !== -1) {
      dados[professorIndex] = { ...professorEditando };
      modalCadastroProfessorAberto.value = false; // Fecha o modal após salvar a edição
    }
  });

  const botoes = [
  { label: "Novo professor", classe: "np", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Novo técnico distrital", classe: "ip", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Novo diretor escolar", classe: "epx", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Novo DAP", classe: "epp", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Listar professores", classe: "np", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Listar Tecnicos distritais", classe: "np", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Atribuir", classe: "np", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Detalhes", classe: "np", visivel: true, acao: "abrirModalCProfessor" },
  { label: "Editar", classe: "ep", visivel: true, acao: "abrirModalEditarProfessor", disabled: linhasSelecionadas.selecionados.length !== 1 },
  { label: "Importar de XLSX", classe: "ip", visivel: true, acao: "abrirModalImportarXLSX" },
  { label: "Exportar para XLSX", classe: "epx", visivel: true, acao: "exportarParaXLSX" },
  { label: "Exportar para PDF", classe: "epp", visivel: true, acao: "exportarParaPDF" }
];




  // Gestao de botoes
  const clicarBotao = $((acao: string) => {
    switch (acao) {
      case "abrirModalCProfessor":

        componenteAtual.value = "np"
        modalCadastroProfessorAberto.value = true;

        break;

      case "abrirModalEditarProfessor":

        componenteAtual.value = "ep"
        modalCadastroProfessorAberto.value = true;

        if (linhasSelecionadas.selecionados.length === 1) {
          const professorSelecionado = dadosProfessores.find((prof) => prof.ID === linhasSelecionadas.selecionados[0]);
          if (professorSelecionado) {
            Object.assign(professorEditando, professorSelecionado);
            modalCadastroProfessorAberto.value = true;
          }
        } else {
          alert("Selecione uma única linha para editar.");
        }

        break;

      case "exportarParaPDF":
      componenteAtual.value = "epp";

      // Verifique se há dados a serem exportados
      if (!dadosOrdenados || dadosOrdenados.length === 0) {
        alert("Não há dados para exportar.");
        break;
      }

      // Criação do documento PDF
      const doc = new jsPDF();

      // Filtra as colunas visíveis
      const colunasAtuais = colunas.filter((coluna) => colunasVisiveis.has(coluna));
      
      // Verifique se existem colunas visíveis
      if (colunasAtuais.length === 0) {
        alert("Nenhuma coluna visível para exportação.");
        break;
      }

      // Filtra as linhas selecionadas ou todas, caso nenhuma tenha sido selecionada
      const linhasParaExportar = dadosOrdenados.filter((linha) =>
        linhasSelecionadas.selecionados.length === 0 || linhasSelecionadas.selecionados.includes(linha.ID)
      );

      // Se nenhuma linha for selecionada, exibe um alerta
      if (linhasParaExportar.length === 0) {
        alert("Nenhuma linha selecionada para exportar.");
        break;
      }

      // Mapeia as linhas para as colunas visíveis
      const linhas = linhasParaExportar.map((linha) =>
        colunasAtuais.map((coluna) => linha[coluna])
      );

      // Adiciona o título ao documento
      doc.text("Lista de Professores", 10, 10);

      // Gera a tabela no PDF
      doc.autoTable({
        head: [colunasAtuais], // Cabeçalho com as colunas visíveis
        body: linhas, // Linhas de dados a serem exibidas
        startY: 20, // Inicia a tabela após o título
        theme: 'grid', // Estilo de tabela com grid
        margin: { top: 30 }, // Ajusta a margem superior
        styles: {
          font: 'Helvetica',
          fontSize: 10,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [0, 51, 102], // Cor de fundo do cabeçalho
          textColor: [255, 255, 255], // Cor do texto do cabeçalho
        },
      });

      // Salva o documento PDF gerado com o nome 'Professores.pdf'
      doc.save("Professores.pdf");

      break;


      default:
        console.log("Ação não reconhecida");
    }
  });

  return (
    <div class="container mt-4">
      <div class="row">
        {/* Seção para Gerenciar Colunas e Buscar */}
        <div class="col-md-10">
          <h5>Gerenciar Colunas</h5>
          <p 
              className={` ${painel === "tecnico" ? "d-block" : "d-none"}`} 
          >
            Este painel deve ser acessivel para apenas o tecnico provincial
          </p>

          <p 
              className={` ${painel === "director" ? "d-block" : "d-none"}`} 
          >
            Este painel deve ser acessivel para apenas o tecnico distrital
          </p>

          <p 
              className={` ${painel === "dap" ? "d-block" : "d-none"}`} 
          >
            Este painel deve ser acessivel para apenas o tecnico distrital
          </p>
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
                      checked={linhasSelecionadas.selecionados.length === dadosProfessores.length}
                      onChange$={selecionarTodasLinhas}
                    />
                  </th>
                  {
                    colunas.filter((coluna) => colunasVisiveis.value.has(coluna)).map((coluna) => (
                    <th key={coluna} onClick$={() => ordenarPorColuna(coluna)} style={{ cursor: "pointer" }}>
                      {coluna} {colunaOrdenacao.value === coluna ? (ordemAscendente.value ? "⬆️" : "⬇️") : ""}
                    </th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  dadosOrdenados.map((linha, index) => (
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
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de Ações */}
        <div class="col-md-2">
          <h5>Ações</h5>
          <div class="g-3">
            
            {botoes.map((botao, index) => (
              botao.visivel && (
                <button
                  key={index}
                  className={`btn mt-2 w-100 ${componenteAtual.value === botao.classe ? "btn-success" : "btn-outline-primary"}`}
                  onClick$={() => clicarBotao(botao.acao)}
                  disabled={botao.disabled}
                >
                  {botao.label}
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Modal para Editar Professor */}
      {modalCadastroProfessorAberto.value && (
        <div class="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{componenteAtual.value === "np" ?  "Cadastrar novo professor" : "Editar dados do professor"}</h5>
                <button type="button" class="btn-close" onClick$={fecharModalCProfessor}></button>
              </div>
              <div class="modal-body">
                {colunas.slice(1).map((coluna) => (
                  <div class="form-floating mb-2" key={coluna}>
                    <input
                      id={coluna}
                      class="form-control"
                      value={componenteAtual.value === "np" ?  "" : professorEditando[coluna] || ''} // Garante que o valor seja uma string vazia se não houver valor
                      onInput$={(e) => { 
                        professorEditando[coluna] = e.target.value; // Atualiza o valor do campo ao digitar
                      }}
                    />
                    <label for={coluna}>{coluna}</label>
                  </div>
                ))}
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" onClick$={fecharModalCProfessor}>Cancelar</button>
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
