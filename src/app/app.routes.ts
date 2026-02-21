import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AdminMenuComponent } from './Administrador/Components/admin-menu/admin-menu.component';
import { CocinaMenuComponent } from './Cocinero/Components/cocina-menu/cocina-menu.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
{ path: 'admin-menu', component: AdminMenuComponent }, // Si tienes guard
{ path: 'cocina-menu', component: CocinaMenuComponent }
];



