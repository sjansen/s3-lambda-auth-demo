const dev = {
    clientId: '511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com',
    openIdConnectUrl: 'https://accounts.google.com',
    redirectURL: 'http://localhost:8000/callback',
    scope: 'openid',
};

const prod = {
    clientId: 'TODO',
    openIdConnectUrl: 'TODO',
    redirectURL: 'TODO',
    scope: 'TODO',
};

const config = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;

export default {
    ...config
};