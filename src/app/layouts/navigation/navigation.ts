// navigation.ts

export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  children?: NavigationItem[];
}



export const NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },

  

  {
    id: 'content',
    title: 'Content',
    icon: 'library_books',
    children: [
      {
        id: 'subjects',
        title: 'Subjects',
        icon: 'book',
        route: '/subjects'
      },
      {
        id: 'chapters',
        title: 'Chapters',
        icon: 'menu_book',
        route: '/chapters'
      },
      {
        id: 'topics',
        title: 'Topics',
        icon: 'category',
        route: '/topics'
      },
      {
        id: 'lessons',
        title: 'Lessons',
        icon: 'school',
        route: '/lessons'
      },
      {
        id: 'lesson-resources',
        title: 'Lesson Resources',
        icon: 'folder',
        route: '/lesson-resources'
      },
      {
        id: 'practice-questions',
        title: 'Practice Questions',
        icon: 'quiz',
        route: '/practice-questions'
      },
      {
        id: 'tags',
        title: 'Tags',
        icon: 'sell',
        route: '/tags'
      }
    ]
  },

  {
    id: 'users',
    title: 'Users',
    icon: 'group',
    children: [
      {
        id: 'all-users',
        title: 'All Users',
        icon: 'people',
        route: '/users'
      },
      {
        id: 'roles',
        title: 'Roles',
        icon: 'admin_panel_settings',
        route: '/roles'
      }
    ]
  },

  {
    id: 'progress',
    title: 'Progress & Analytics',
    icon: 'analytics',
    children: [
      {
        id: 'progress',
        title: 'Progress',
        icon: 'trending_up',
        route: '/progress'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: 'bar_chart',
        route: '/analytics'
      }
    ]
  },

  {
    id: 'storage',
    title: 'Storage',
    icon: 'cloud',
    children: [
      {
        id: 'files',
        title: 'Uploaded Files',
        icon: 'folder_open',
        route: '/storage/files'
      },
      {
        id: 'buckets',
        title: 'Buckets',
        icon: 'dns',
        route: '/storage/buckets'
      }
    ]
  },

  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    children: [
      {
        id: 'jwt',
        title: 'JWT Settings',
        icon: 'vpn_key',
        route: '/settings/jwt'
      },
      {
        id: 'uploads',
        title: 'Upload Options',
        icon: 'upload_file',
        route: '/settings/uploads'
      }
    ]
  },

  {
    id: 'logs',
    title: 'Logs & Seeders',
    icon: 'receipt_long',
    children: [
      {
        id: 'logs',
        title: 'Logs',
        icon: 'description',
        route: '/logs'
      },
      {
        id: 'seeders',
        title: 'Seeders',
        icon: 'data_object',
        route: '/seeders'
      }
    ]
  }
];