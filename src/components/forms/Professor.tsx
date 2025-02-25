// src/components/forms/Professor.tsx
import { component$, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const name = useSignal('');
  const navigate = useNavigate();

  const handleSubmit = $(async () => {
    const response = await fetch('/api/teachers', {
      method: 'POST',
      body: JSON.stringify({ name: name.value, schoolId: 'some-school-id' }),
    });
    if (response.ok) {
      navigate('/dashboard/school');
    }
  });

  return (
    <div>
      <h2>Adicionar Professor</h2>
      <input type="text" bind:value={name} placeholder="Nome do professor" />
      <button onClick$={handleSubmit}>Salvar</button>
    </div>
  );
});