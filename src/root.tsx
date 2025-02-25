import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { isDev } from '@builder.io/qwik';
import { AuthProvider } from './context/auth';

import './global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default component$(() => {
  console.log('1. Root começando a renderizar');

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />
        )}
        <RouterHead />
        {console.log('2. Head renderizado')}
      </head>
      <body lang="en">
        {console.log('3. Antes do AuthProvider')}
        <AuthProvider>
          {console.log('4. Dentro do AuthProvider, antes do RouterOutlet')}
          <RouterOutlet />
          {console.log('5. RouterOutlet renderizado')}
          {!isDev && <ServiceWorkerRegister />}
        </AuthProvider>
        {console.log('6. Após o AuthProvider')}
      </body>
    </QwikCityProvider>
  );
});