import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AdminMenuComponent } from './Administrador/Components/admin-menu/admin-menu.component';
import { CocinaMenuComponent } from './Cocinero/Components/cocina-menu/cocina-menu.component';
import { CajeroMenuComponent } from './Cajero/Components/cajero-menu/cajero-menu.component';
import { MozoMenuComponent } from './Mozo/Components/mozo-menu/mozo-menu.component';
import { PedidoComponent } from './Mozo/Components/pedido/pedido.component';
import { InsumosComponent } from './Administrador/Components/insumos/insumos.component';
import { RolesComponent } from './Administrador/Components/roles/roles.component';
import { UsuariosComponent } from './Administrador/Components/usuarios/usuarios.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', 
    component: LoginComponent},
{ path: 'admin-menu', component: AdminMenuComponent, 
     children: [
      { path: 'insumos', component: InsumosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      // { path: 'productos', component: ProductosComponent },
      // { path: 'usuarios', component: UsuariosComponent },
    ] }, 
{ path: 'cocina-menu', component: CocinaMenuComponent },
{ path: 'cajero-menu', component: CajeroMenuComponent },
{ path: 'mozo-menu', component: MozoMenuComponent },
{ path: 'pedido/:idMesa', component: PedidoComponent }
];



