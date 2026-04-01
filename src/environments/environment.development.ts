export const environment = {
  production: false,
  apiUrl: 'http://localhost:5039/api/v1',
  challenges: {
    'the-long-walk': {
      leagueSlug: 'polar-colombia',
      challengeId: 1130,
    },
  } as Record<string, { leagueSlug: string; challengeId: number }>,
  appName: 'OpenSwetro',
  appDescription: 'OpenSwetro - Your Ultimate Coding Challenge Platform',
  appImageUrl: '/images/open-graph/swetro.png',
  appUrl: 'http://localhost:4200',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'],
  defaultLeagueSlug: 'swetro',
  googleClientId: '926555311627-qp6s9dge9tomv0ce6k3gos73tpldkhd5.apps.googleusercontent.com',
};
