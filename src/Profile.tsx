import React, {useEffect, useState} from 'react';
import {Paper, Theme} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
    AuthorizationNotifier,
    AuthorizationServiceConfiguration,
    BaseTokenRequestHandler,
    DefaultCrypto,
    FetchRequestor,
    GRANT_TYPE_AUTHORIZATION_CODE,
    LocalStorageBackend,
    RedirectRequestHandler,
    TokenRequest,
} from '@openid/appauth';

import environment from "./environment";
import {NoHashQueryStringUtils} from './noHashQueryStringUtils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
    }),
);

const Profile: React.FC = () => {
    const classes = useStyles();

    const [error, setError] = useState<string|null>(null);
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [refreshToken, setRefreshToken] = useState<string|undefined>();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) {
            setError('Unable to get authorization code');
            return;
        }

        const tokenHandler = new BaseTokenRequestHandler(
            new FetchRequestor(),
        );
        const authorizationHandler = new RedirectRequestHandler(
            new LocalStorageBackend(),
            new NoHashQueryStringUtils(),
            window.location,
            new DefaultCrypto(),
        );
        const notifier = new AuthorizationNotifier();
        authorizationHandler.setAuthorizationNotifier(notifier);
        notifier.setAuthorizationListener((request, response, error) => {
            if (response) {
                let extras = undefined;
                if (request && request.internal) {
                    extras = {
                        code_verifier: request.internal.code_verifier,
                    };
                }

                const tokenRequest = new TokenRequest({
                    client_id: environment.clientId,
                    redirect_uri: environment.redirectURL,
                    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
                    code: response.code,
                    refresh_token: undefined,
                    extras
                });

                AuthorizationServiceConfiguration.fetchFromIssuer(environment.openIdConnectUrl, new FetchRequestor())
                    .then((oResponse) => {
                        const configuration = oResponse;
                        return tokenHandler.performTokenRequest(configuration, tokenRequest);
                    })
                    .then((oResponse) => {
                        setAccessToken(oResponse.accessToken);
                        setRefreshToken(oResponse.refreshToken);
                        const state = window.history.state;
                        window.history.replaceState(state, "", "/");
                    })
                    .catch(oError => {
                        setError(oError);
                    });
            }
        });

        authorizationHandler.completeAuthorizationRequestIfPossible();
    }, []);

    return <Paper className={classes.root} variant="outlined">
        {error
            ? <p>ERROR: {error}</p>
            : <dl>
                <dt>username:</dt><dd>TODO</dd>
                <dt>accessToken:</dt><dd>{accessToken}</dd>
                <dt>refreshToken:</dt><dd>{refreshToken}</dd>
            </dl>
        }
    </Paper>;
};

export default Profile;
