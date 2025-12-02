export const environment = {
  production: true,
  auth0: {
    domain: 'csediualumni.us.auth0.com',
    clientId: '8cJDXN0svn090g4pqmS99Fqq7sOjYR6o',
    authorizationParams: {
      redirect_uri: 'https://admin.csediualumni.com', // Admin panel production URL
      audience: 'https://api.csedialumni.com',
      scope: 'openid profile email offline_access',
    },
    cacheLocation: 'localstorage' as const,
    useRefreshTokens: true,
  },
  apiUrl: 'https://api.csediualumni.com',
};
