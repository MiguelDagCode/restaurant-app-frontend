import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { MesaComponent } from './components/mesa/mesa.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { RegistrarUsuarioComponent } from './auth/components/registrar-usuario/registrar-usuario.component';
import { MozoMenuComponent } from './components/mozo-menu/mozo-menu.component';
import { CajeroMenuComponent } from './components/cajero-menu/cajero-menu.component';
import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido.component';
import { PagoComponent } from './components/pago/pago.component';
import { PlatoComponent } from './components/plato/plato.component';
import { CategoriaPlatoComponent } from './components/categoria-plato/categoria-plato.component';
import { ReportAdminComponent } from './components/report-admin/report-admin.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrarUsuarioComponent }, 
  { 
    path: 'admin-menu', 
    component: AdminMenuComponent,
    children:[
      { path: 'platos', component: PlatoComponent },
      { path: 'categoria', component: CategoriaPlatoComponent },
      { path: 'reportes', component: ReportAdminComponent }
    ]
  }, 
  { 
    path: 'mozo-menu',  // 👈 sin la barra
    component: MozoMenuComponent,
    children:[
      { path: 'mesas', component: MesaComponent },
      { path: 'pedidos', component: PedidoComponent },
      { path: 'detalle-pedido', component: DetallePedidoComponent } // 👈 mejor usar kebab-case
    ]
  },   
  { 
    path: 'cajero-menu',  // 👈 sin la barra
    component: CajeroMenuComponent,
    children:[
      { path: 'pagos', component: PagoComponent } // 👈 mejor usar minúsculas
    ]
  }   
];



