import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./pages/forgetpassword/forgetpassword.module').then( m => m.ForgetpasswordPageModule)
  },
  {
    path: 'member-list',
    loadChildren: () => import('./pages/member-list/member-list.module').then( m => m.MemberListPageModule)
  },
  {
    path: 'member/:id',
    loadChildren: () => import('./pages/member-details/member-details.module').then( m => m.MemberDetailsPageModule)
  },
  {
    path: 'member-add',
    loadChildren: () => import('./pages/member-add/member-add.module').then( m => m.MemberAddPageModule)
  },
  {
    path: 'addjoin',
    loadChildren: () => import('./pages/addjoin/addjoin.module').then( m => m.AddjoinPageModule)
  },
  {
    path: 'gym-list',
    loadChildren: () => import('./pages/gym-list/gym-list.module').then( m => m.GymListPageModule)
  },
  {
    path: 'gym-details/:id',
    loadChildren: () => import('./pages/gym-details/gym-details.module').then( m => m.GymDetailsPageModule)
  },
  {
    path: 'gym-add',
    loadChildren: () => import('./pages/gym-add/gym-add.module').then( m => m.GymAddPageModule)
  },
  {
    path: 'join-gym',
    loadChildren: () => import('./pages/join-gym/join-gym.module').then( m => m.JoinGymPageModule)
  },
  {
    path: 'member-action',
    loadChildren: () => import('./pages/member-action/member-action.module').then( m => m.MemberActionPageModule)
  },
  {
    path: 'member-update/:id',
    loadChildren: () => import('./pages/member-update/member-update.module').then( m => m.MemberUpdatePageModule)
  },
  {
    path: 'qrlabel/:id',
    loadChildren: () => import('./pages/qrlabel/qrlabel.module').then( m => m.QrlabelPageModule)
  },
  {
    path: 'membercontrol/:id',
    loadChildren: () => import('./pages/membercontrol/membercontrol.module').then( m => m.MembercontrolPageModule)
  },
  {
    path: 'gmap',
    loadChildren: () => import('./pages/gmap/gmap.module').then( m => m.GmapPageModule)
  },
  // {
  //   path: 'me',
  //   loadChildren: () => import('./pages/me/me.module').then( m => m.MePageModule)
  // },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./static/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms-condition',
    loadChildren: () => import('./static/terms-condition/terms-condition.module').then( m => m.TermsConditionPageModule)
  },
  // {
  //   path: 'infor',
  //   loadChildren: () => import('./pages/infor/infor.module').then( m => m.InforPageModule)
  // },
  // {
  //   path: 'memberinfor',
  //   loadChildren: () => import('./pages/memberinfor/memberinfor.module').then( m => m.MemberinforPageModule)
  // },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/membertabs/membertabs.module').then( m => m.MembertabsPageModule)
  },
  {
    path: 'gymtabs',
    loadChildren: () => import('./pages/gymtabs/gymtabs.module').then( m => m.GymtabsPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
