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
};
