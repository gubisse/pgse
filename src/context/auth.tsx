import { 
  $, 
  component$, 
  createContextId, 
  useContext, 
  useContextProvider, 
  useStore, 
  useVisibleTask$ 
} from '@builder.io/qwik';
import { RouterOutlet } from '@builder.io/qwik-city';
import type { User } from '../models/User';

export interface AuthState {
  user: User | null;
}

export const AuthContext = createContextId<AuthState>('auth-context');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface AuthProviderProps {
  children: any;
  /**
   * Usuário inicial pode ser carregado via um loader do Qwik City
   * no lado do servidor, garantindo consistência na renderização inicial.
   */
  initialUser?: User | null;
}

export const AuthProvider = component$<AuthProviderProps>((props) => {
  // Inicializa o estado com o usuário vindo do SSR, se disponível.
  const authState = useStore<AuthState>({
    user: props.initialUser ?? null,
  });

  // No cliente, sincroniza o estado com o localStorage.
  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          // Se o estado estiver vazio, atualiza com o valor do localStorage.
          if (!authState.user) {
            authState.user = parsedUser;
            console.log('AuthProvider: Carregado do localStorage:', authState.user);
          }
        } catch (error) {
          console.error('Erro ao parsear o usuário do localStorage:', error);
        }
      } else if (authState.user) {
        // Se houver um usuário no estado mas não no localStorage, salva-o.
        localStorage.setItem('authUser', JSON.stringify(authState.user));
        console.log('AuthProvider: Salvo no localStorage:', authState.user);
      }
    }
  });

  // Disponibiliza o estado de autenticação para a árvore de componentes.
  useContextProvider(AuthContext, authState);

  return (
    <>
      {props.children}
      <RouterOutlet />
    </>
  );
});

// Função para atualizar o usuário no estado e no localStorage (somente no cliente).
export const setAuthUser = $((auth: AuthState, user: User | null) => {
  auth.user = user;
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
      console.log('setAuthUser: Salvo no localStorage:', user);
    } else {
      localStorage.removeItem('authUser');
      console.log('setAuthUser: Removido do localStorage');
    }
  }
});
