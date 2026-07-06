export const Endpoints = {
  auth: {
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
  },

  subjects: {
    list: '/api/subjects',
    getById: (id: string) => `/api/subjects/${id}`,
    create: '/api/subjects',
    update: (id: string) => `/api/subjects/${id}`,
    delete: (id: string) => `/api/subjects/${id}`,
    chapters: (id: string) => `/api/subjects/${id}/chapters`,
  },

  chapters: {
    list: '/api/chapters',
    getById: (id: string) => `/api/chapters/${id}`,
    create: '/api/chapters',
    update: (id: string) => `/api/chapters/${id}`,
    delete: (id: string) => `/api/chapters/${id}`,
    topics: (id: string) => `/api/chapters/${id}/topics`,
  },
};
