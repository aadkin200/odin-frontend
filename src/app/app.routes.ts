import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
export const routes: Routes = [
  {path:'',loadComponent:()=>import('./pages/home.component').then(m=>m.HomeComponent),title:"Odin's Chosen MC"},
  {path:'introduction',loadComponent:()=>import('./pages/introduction.component').then(m=>m.IntroductionComponent),title:"Introduction — Odin's Chosen"},
  {path:'odins-law',loadComponent:()=>import('./pages/law.component').then(m=>m.LawComponent),title:"Odin's Law"},
  {path:'structure',loadComponent:()=>import('./pages/structure.component').then(m=>m.StructureComponent),title:'Club Structure'},
  {path:'cashflow',canActivate:[authGuard],loadComponent:()=>import('./cashflow/cashflow.component').then(m=>m.CashflowComponent),title:'Cashflow — High Command'},
  {path:'access-denied',loadComponent:()=>import('./pages/access-denied.component').then(m=>m.AccessDeniedComponent),title:'Access Denied'},
  {path:'**',redirectTo:''}
];
