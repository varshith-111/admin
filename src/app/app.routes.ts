import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'create-article', 
    loadComponent: () => import('./components/create-article/create-article.component').then(m => m.CreateArticleComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'create-news-article', 
    loadComponent: () => import('./components/create-news-article/create-news-article.component').then(m => m.CreateNewsArticleComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit-article/:id', 
    loadComponent: () => import('./components/create-news-article/create-news-article.component').then(m => m.CreateNewsArticleComponent),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];