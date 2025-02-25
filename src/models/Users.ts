import { component$, Slot } from "@builder.io/qwik";
import { ProfessoresProvider } from "./professor/ProfessoresProvider";

export const AppProvider = component$(() => {
  return (
    <ProfessoresProvider>
  		<div>Ola mundo</div>
      <Slot />
    </ProfessoresProvider>
  );
});
