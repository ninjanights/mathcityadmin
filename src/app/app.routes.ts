import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [

  // Authentication (No Navbar)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Admin Layout (Navbar + Pages)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.dashboardRoutes)
      },

      {
        path: 'subjects',
        loadChildren: () =>
          import('./features/subjects/subjects.routes')
            .then(m => m.subjectsRoutes)
      },

      {
        path: 'topics',
        loadChildren: () =>
          import('./features/topics/topics.routes')
            .then(m => m.topicsRoutes)
      },

      {
        path: 'lessons',
        loadChildren: () =>
          import('./features/lessons/lesson.routes')
            .then(m => m.lessonRoutes)
      }

    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];