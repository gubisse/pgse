import { $, component$, createContextId, useContext, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { RouterOutlet } from '@builder.io/qwik-city';

interface AuthState {
  user: { role: string } | null;
}

export const AuthContext = createContextId<AuthState>('auth-context');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = component$(({ children }: { children: any }) => {
  const initialUser = typeof window !== 'undefined' && localStorage.getItem('authUser')
    ? JSON.parse(localStorage.getItem('authUser')!)
    : null;

  const authState = useStore<AuthState>({
    user: initialUser,
  });

  useTask$(({ track }) => {
    track(() => authState.user);
    if (typeof window !== 'undefined') {
      if (authState.user) {
        localStorage.setItem('authUser', JSON.stringify(authState.user));
      } else {
        localStorage.removeItem('authUser');
      }
    }
  });

  useContextProvider(AuthContext, authState);

  return (
    <>
      {children}
      <RouterOutlet />
    </>
  );
});

export const setAuthUser = $((auth: AuthState, user: { role: string } | null) => {
  auth.user = user;
});