const config = {
    clientId: process.env.REACT_APP_CLIENT_ID || 'MISSING',
    openIdConnectUrl: process.env.REACT_APP_OIDC_URL || 'MISSING',
    redirectURL: process.env.REACT_APP_REDIRECT_URL || 'MISSING',
};

export default {
    ...config
};
