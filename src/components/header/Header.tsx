import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth, setAuthUser } from '../../context/auth';

export default component$(() => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isMenuOpen = useSignal(false);

  const handleLogout = $(async () => {
    await setAuthUser(auth, null); // Redefine auth.user e limpa localStorage
    navigate('/');
  });

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/" style="font-size: 1.5rem;">Gestão Escolar</a>
        <button
          class="navbar-toggler"
          type="button"
          onClick$={() => (isMenuOpen.value = !isMenuOpen.value)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen.value}
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class={`collapse navbar-collapse ${isMenuOpen.value ? 'show' : ''}`} id="navbarNav">
          <ul class="navbar-nav ms-auto">
            {!auth.user ? (
              <li class="nav-item">
                <a class="nav-link" href="/" style="color: #fff; padding: 10px 15px;">Login</a>
              </li>
            ) : (
              <>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    onClick$={() => (isMenuOpen.value = !isMenuOpen.value)}
                    style="color: #fff; padding: 10px 15px;"
                  >
                    {auth.user.role === 'provincial' ? 'Técnico Provincial' :
                     auth.user.role === 'distrital' ? 'Técnico Distrital' :
                     auth.user.role === 'diretor' ? 'Diretor' : 'Adjunto'}
                  </a>
                  <ul class={`dropdown-menu ${isMenuOpen.value ? 'show' : ''}`} aria-labelledby="navbarDropdown" style="background-color: #343a40;">
                    {auth.user.role === 'provincial' && (
                      <li><a class="dropdown-item" href="/dashboard/provincial" style="color: #fff;">Dashboard</a></li>
                    )}
                    {auth.user.role === 'distrital' && (
                      <li><a class="dropdown-item" href="/dashboard/district" style="color: #fff;">Dashboard</a></li>
                    )}
                    {(auth.user.role === 'diretor' || auth.user.role === 'adjunto') && (
                      <li><a class="dropdown-item" href="/dashboard/escola" style="color: #fff;">Dashboard</a></li>
                    )}
                    <li><hr class="dropdown-divider" style="border-color: #fff;" /></li>
                    <li>
                      <button
                        class="dropdown-item"
                        onClick$={handleLogout}
                        style="color: #fff; background: none; border: none; width: 100%; text-align: left;"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
});