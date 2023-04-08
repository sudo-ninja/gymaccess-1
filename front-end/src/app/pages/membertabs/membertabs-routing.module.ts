import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembertabsPage } from './membertabs.page';

const routes: Routes = [
  {
    path: '',
    component: MembertabsPage,
    children:[
        {
        path: 'member-action',
        children:[
          {
            path:'',
            loadChildren: () => import('../member-action/member-action.module').then( m => m.MemberActionPageModule)
          }]
        
        },
        {
        path: 'memberinfor',
        children:[
          {
            path:'',
            loadChildren: () => import('../memberinfor/memberinfor.module').then( m => m.MemberinforPageModule)
          }]
        },
        {
         path: 'me',
         children:[
          {
            path:'',
            loadChildren: () => import('../me/me.module').then( m => m.MePageModule)
          }
            ]
        },
        {
          path:'',
          redirectTo:'/tabs/member-action',
          pathMatch:'full'
        }
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/member-action',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembertabsPageRoutingModule {}
