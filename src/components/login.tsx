{/*
	Beleza, vamos começar a estruturar a tela de login no Qwik. O fluxo básico será:

		Campos de Entrada: Nome de usuário e senha
		Botão de Login: Validação dos campos e envio para autenticação
		Feedback: Exibir erro caso usuário/senha estejam incorretos
		Redirecionamento: Após login bem-sucedido, redirecionar para a tela principal conforme o perfil

*/}

import { component$, useStore } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const navigate = useNavigate();
  const state = useStore({
    username: '',
    password: '',
    error: '',
  });

  const handleLogin = $(() => {
    if (!state.username || !state.password) {
      state.error = 'Preencha todos os campos';
      return;
    }
    
    // Simulação de autenticação
    if (state.username === 'admin' && state.password === '1234') {
      navigate('/dashboard');
    } else {
      state.error = 'Usuário ou senha inválidos';
    }
  });

  return (
    <div class="flex h-screen items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-semibold text-center mb-4">Login</h2>
        {state.error && <p class="text-red-500 text-sm text-center">{state.error}</p>}
        <input
          type="text"
          class="w-full p-2 border rounded mb-2"
          placeholder="Usuário"
          bind:value={state.username}
        />
        <input
          type="password"
          class="w-full p-2 border rounded mb-2"
          placeholder="Senha"
          bind:value={state.password}
        />
        <button
          onClick$={handleLogin}
          class="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
        >
          Entrar
        </button>
      </div>
    </div>
  );
});
