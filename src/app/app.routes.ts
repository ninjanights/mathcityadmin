import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
  },
  {
    path: 'subjects',
    loadChildren: () => import('./features/subjects/subjects.routes').then((m) => m.subjectsRoutes)
  },
  {
    path: 'topics',
    loadChildren: () => import('./features/topics/topics.routes').then((m) => m.topicsRoutes)
  },
  {
    path: 'lessons',
    loadChildren: () => import('./features/lessons/lesson.routes').then((m) => m.lessonRoutes)
  },
  {
    path: 'lesson-resources',
    loadChildren: () => import('./features/lesson-resources/lesson-resources.routes').then((m) => m.lessonResourcesRoutes)
  },
  {
    path: 'practice-questions',
    loadChildren: () => import('./features/practice-questions/practice-questions.routes').then((m) => m.practiceQuestionsRoutes)
  },
  {
    path: 'tags',
    loadChildren: () => import('./features/tags/tags.routes').then((m) => m.tagsRoutes)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./features/bookmarks/bookmarks.routes').then((m) => m.bookmarksRoutes)
  },
  {
    path: 'progress',
    loadChildren: () => import('./features/progress/progress.routes').then((m) => m.progressRoutes)
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then((m) => m.usersRoutes)
  }
];