import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Tu componente raíz
import { appConfig } from './app/app.config'; // 👈 ¡AQUÍ IMPORTAMOS LA CONFIGURACIÓN!

// 🚀 Arrancamos la app pasándole el appConfig que contiene nuestro interceptor
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));