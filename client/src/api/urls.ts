// API endpoint URLs

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/signup',
  LOGOUT: '/auth/logout',
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/users/me',
  TEAMS: '/users/me/teams',
  IDEAS: '/users/me/ideas',
};

// Hackathon endpoints
export const HACKATHON_ENDPOINTS = {
  GET_ALL: '/hackathons',
  CREATE: '/create-hackathon',
  GET_BY_ID: (id: number) => `/hackathons/${id}`,
  UPDATE: (id: number) => `/hackathons/${id}`,
  REGISTER: (id: number) => `/hackathons/${id}/register`,
  CREATE_TEAM: (id: number) => `/hackathons/${id}/teams`,
};

// Team endpoints
export const TEAM_ENDPOINTS = {
  GET_BY_ID: (id: number) => `/teams/${id}`,
  INVITE: (id: number) => `/teams/${id}/invite`,
  JOIN: '/teams/join',
  CREATE_IDEA: (id: number) => `/teams/${id}/ideas`,
};

// Idea endpoints
export const IDEA_ENDPOINTS = {
  GET_ALL: '/ideas',
  GET_BY_ID: (id: number) => `/ideas/${id}`,
  ADD_COMMENT: (id: number) => `/ideas/${id}/comments`,
  ENDORSE: (id: number) => `/ideas/${id}/endorse`,
};

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  RESPOND: (id: number) => `/notifications/${id}/respond`,
};
