import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '../../context/auth';

export default component$(({ allowedRoles }: { allowedRoles: string[] }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useVisibleTask$(({ track }) => {
    track(() => auth.user);
    if (!auth.user) {
      console.log('Iniciando redirecionamento para /');
      navigate('/').then(() => {
        console.log('Redirecionamento para / concluído');
      }).catch((err) => {
        console.error('Erro ao redirecionar para /:', err);
      });
    }
  });

  console.log('Renderizando RoleGuard, auth.user:',  auth.user);

  if (!auth.user) {
    return <div>Redirecionando para o login... {auth.user}</div>;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <div>Acesso negado</div>;
  }

  return <Slot />;
});