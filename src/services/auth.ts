export const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Falha na autenticação');
  }

  const data = await response.json();
  return data.user; // Espera-se que retorne { id, name, email, role }
};