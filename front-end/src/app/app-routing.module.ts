import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [

  {
    path: 'landingpage',
    loadChildren: () => import('./landingpage/landingpage.module').then( m => m.LandingpagePageModule)
  },

  {
    path: '',
    redirectTo: 'landingpage',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
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
    loadChildren: () => import('./pages/member-list/member-list.module').then( m => m.MemberListPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'member/:id',
    loadChildren: () => import('./pages/member-details/member-details.module').then( m => m.MemberDetailsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'member-add',
    loadChildren: () => import('./pages/member-add/member-add.module').then( m => m.MemberAddPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'addjoin',
    loadChildren: () => import('./pages/addjoin/addjoin.module').then( m => m.AddjoinPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'gym-list',
    loadChildren: () => import('./pages/gym-list/gym-list.module').then( m => m.GymListPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'gym-details/:id',
    loadChildren: () => import('./pages/gym-details/gym-details.module').then( m => m.GymDetailsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'gym-add',
    loadChildren: () => import('./pages/gym-add/gym-add.module').then( m => m.GymAddPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'join-gym',
    loadChildren: () => import('./pages/join-gym/join-gym.module').then( m => m.JoinGymPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'member-action',
    loadChildren: () => import('./pages/member-action/member-action.module').then( m => m.MemberActionPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'member-update/:id',
    loadChildren: () => import('./pages/member-update/member-update.module').then( m => m.MemberUpdatePageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'qrlabel/:id',
    loadChildren: () => import('./pages/qrlabel/qrlabel.module').then( m => m.QrlabelPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'membercontrol/:id',
    loadChildren: () => import('./pages/membercontrol/membercontrol.module').then( m => m.MembercontrolPageModule), 
    canActivate: [AuthGuard]
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
    loadChildren: () => import('./pages/membertabs/membertabs.module').then( m => m.MembertabsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'gymtabs',
    loadChildren: () => import('./pages/gymtabs/gymtabs.module').then( m => m.GymtabsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./static/settings/settings.module').then( m => m.SettingsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'personalinformation',
    loadChildren: () => import('./static/personalinformation/personalinformation.module').then( m => m.PersonalinformationPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./static/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'chathome',
    loadChildren: () => import('./chatpages/chathome/chathome.module').then( m => m.ChathomePageModule)
  },
  {
    path: 'feedback-alert',
    loadChildren: () => import('./pages/feedback-alert/feedback-alert.module').then( m => m.FeedbackAlertPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'addlock',
    loadChildren: () => import('./pages/addlock/addlock.module').then( m => m.AddlockPageModule)
  },

  



 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
