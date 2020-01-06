const dev = {
    clientId: process.env.REACT_APP_CLIENT_ID || '511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com',
    openIdConnectUrl: process.env.REACT_APP_OIDC_URL || 'https://accounts.google.com/',
    redirectURL: process.env.REACT_APP_REDIRECT_URL || 'http://localhost:8000/callback',
};

const prod = {
    clientId: process.env.REACT_APP_CLIENT_ID || 'MISSING',
    openIdConnectUrl: process.env.REACT_APP_OIDC_URL || 'MISSING',
    redirectURL: process.env.REACT_APP_REDIRECT_URL || 'MISSING',
};

const config = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;

export default {
    ...config
};
