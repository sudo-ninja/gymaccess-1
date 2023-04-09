import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GymtabsPage } from './gymtabs.page';

const routes: Routes = [
  {
    path: '',
    component: GymtabsPage,
    children:[
      {
        path: 'member-list',
        children:[
          {
            path:'',
            loadChildren: () => import('../member-list/member-list.module').then( m => m.MemberListPageModule)
          }]      
        },
      {
      path: 'infor',
      children:[
        {
          path:'',
          loadChildren: () => import('../infor/infor.module').then( m => m.InforPageModule)
        }]      
      },
      {
      path: 'me',
      children:[
        {
          path:'',
          loadChildren: () => import('../me/me.module').then( m => m.MePageModule)
        }]
      },
      {
        path:'',
        redirectTo:'/gymtabs/member-list',
        pathMatch:'full'
      }
    ]
  },
  {
    path:'',
    redirectTo:'/gymtabs/member-list',
    pathMatch:'full'
  }


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GymtabsPageRoutingModule {}
