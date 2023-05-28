import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChathomePage } from './chathome.page';

const routes: Routes = [
  {
    path: '',
    component: ChathomePage
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChathomePageRoutingModule {}
