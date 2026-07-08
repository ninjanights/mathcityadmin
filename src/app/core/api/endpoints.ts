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

  topics: {
    list: '/api/topics',
    create: '/api/topics',
    getById: (id: string) => `/api/topics/${id}`,
    update: (id: string) => `/api/topics/${id}`,
    delete: (id: string) => `/api/topics/${id}`,
    move: (id: string) => `/api/topics/${id}/move`,
    lessons: (id: string) => `/api/topics/${id}/lessons`,
  },

  tags: {
    list: '/api/tags',
    create: '/api/tags',
    getById: (id: string) => `/api/tags/${id}`,
    update: (id: string) => `/api/tags/${id}`,
    delete: (id: string) => `/api/tags/${id}`,
  },

  lessons: {
    list: '/api/lessons',
    create: '/api/lessons',

    getById: (id: string) => `/api/lessons/${id}`,
    update: (id: string) => `/api/lessons/${id}`,
    delete: (id: string) => `/api/lessons/${id}`,

    move: (id: string) => `/api/lessons/${id}/move`,

    resources: (lessonId: string) => `/api/lessons/${lessonId}/resources`,

    practiceQuestions: (lessonId: string) => `/api/lessons/${lessonId}/practicequestions`,

    tags: (lessonId: string) => `/api/lessons/${lessonId}/tags`,
    addTag: (lessonId: string) => `/api/lessons/${lessonId}/tags`,
    removeTag: (lessonId: string, tagId: string) => `/api/lessons/${lessonId}/tags/${tagId}`,
  },
};
