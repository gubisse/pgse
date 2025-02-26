import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth, setAuthUser } from '../context/auth';
import { User } from '../models/User'; // Importa o modelo User

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

export default component$(() => {
  const email = useSignal('');
  const password = useSignal('');
  const error = useSignal('');
  const navigate = useNavigate();
  const auth = useAuth();

 
  const handleLogin = $(async () => {
    try {
      const user = await fakeLogin(email.value, password.value);
      await setAuthUser(auth, user);
      console.log('Login concluído, auth.user:', auth.user);
      switch (user.role) {
        case 'provincial': navigate('/dashboard/provincial'); break;
        case 'distrital': navigate('/dashboard/district'); break;
        case 'diretor':
        case 'adjunto': navigate('/dashboard/escola'); break;
        default: error.value = 'Papel de usuário inválido';
      }
    } catch (err) {
      error.value = 'Erro ao fazer login. Verifique suas credenciais.';
    }
  });
  

  if (auth.user) {
    return (
      <>
        <Header />
        <div style="text-align: center; padding: 20px;">Redirecionando para seu dashboard...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style="max-width: 400px; margin: 50px auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="text-align: center; color: #343a40; margin-bottom: 20px;">Gestão Escolar - Login</h1>
        <form preventdefault:submit onSubmit$={handleLogin}>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #495057;">Email:</label>
            <input
              type="email"
              value={email.value}
              onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
              required
              style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 16px;"
              placeholder="Digite seu email"
            />
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #495057;">Senha:</label>
            <input
              type="password"
              value={password.value}
              onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
              required
              style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 16px;"
              placeholder="Digite sua senha"
            />
          </div>
          {error.value && (
            <p style="color: #dc3545; text-align: center; margin-bottom: 15px;">{error.value}</p>
          )}
          <button
            type="submit"
            style="width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; transition: background-color 0.3s;"
            onMouseOver$={(e) => ((e.target as HTMLElement).style.backgroundColor = '#0056b3')}
            onMouseOut$={(e) => ((e.target as HTMLElement).style.backgroundColor = '#007bff')}
          >
            Entrar
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
});

const fakeLogin = $(async (email: string, password: string): Promise<User> => {
  if (email === 'provincial@example.com' && password === '123') {
    return { id: '1', name: 'Técnico Provincial', email, role: 'provincial' };
  } else if (email === 'distrital@example.com' && password === '123') {
    return { id: '2', name: 'Técnico Distrital', email, role: 'distrital' };
  } else if (email === 'diretor@example.com' && password === '123') {
    return { id: '3', name: 'Diretor', email, role: 'diretor' };
  } else if (email === 'adjunto@example.com' && password === '123') {
    return { id: '4', name: 'Adjunto', email, role: 'adjunto' };
  }
  throw new Error('Credenciais inválidas');
});