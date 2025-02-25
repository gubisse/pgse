import { component$, useTask$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import RoleGuard from '../../../components/auth/RoleGuard';
import { useAuth, setAuthUser } from '../../../context/auth';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

export default component$(() => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = $(async () => {
    console.log('Fazendo logout, auth.user antes:', auth.user);
    await setAuthUser(auth, null); // Redefine auth.user para null
    console.log('Logout concluído, auth.user agora:', auth.user);
    navigate('/'); // Redireciona para login
  });

  return (
    <RoleGuard allowedRoles={['distrital']}>
      <Header />
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="text-align: center; color: #343a40; margin-bottom: 20px;">Dashboard da Escola</h1>
        <p style="text-align: center; color: #495057;">Bem-vindo, {auth.user?.role === 'diretor' ? 'Diretor' : 'Adjunto'}!</p>
        <button
          onClick$={handleLogout}
          style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; transition: background-color 0.3s;"
          onMouseOver$={(e) => ((e.target as HTMLElement).style.backgroundColor = '#b02a37')}
          onMouseOut$={(e) => ((e.target as HTMLElement).style.backgroundColor = '#dc3545')}
        >
          Sair
        </button>
      </div>
      <Footer />
    </RoleGuard>
  );
});