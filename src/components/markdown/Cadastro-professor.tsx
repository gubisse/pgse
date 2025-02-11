import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { marked } from "marked";

export const CadastroProfessor = component$(() => {
  const markdownContent = useSignal("");

  useTask$(async ({ track }) => {
    track(() => markdownContent.value); // Garante a reatividade
    try {
      const response = await fetch("/docs/cadastro-professor.md"); // Caminho do arquivo
      markdownContent.value = await response.text();
    } catch (error) {
      console.error("Erro ao carregar Markdown:", error);
      markdownContent.value = "Erro ao carregar a documentação.";
    }
  });

  return (
    <div class="container mt-4">
      <h1>📄 Documentação</h1>
      <div
        class="markdown-body"
        dangerouslySetInnerHTML={markdownContent.value ? marked(markdownContent.value) : ""}
      />
    </div>
  );
});
