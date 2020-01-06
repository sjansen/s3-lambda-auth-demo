import React, {useState} from 'react';
import {Button, Paper, Theme} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
    AuthorizationServiceConfiguration,
    AuthorizationRequest, RedirectRequestHandler,
    FetchRequestor, LocalStorageBackend, DefaultCrypto
} from '@openid/appauth';

import {NoHashQueryStringUtils} from './noHashQueryStringUtils';
import environment from './environment';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
    }),
);

const SignIn: React.FC = () => {
    const classes = useStyles();

    const [error, setError] = useState<string|null>(null);
    const authorizationHandler = new RedirectRequestHandler(
        new LocalStorageBackend(),
        new NoHashQueryStringUtils(),
        window.location,
        new DefaultCrypto(),
    );
    const redirect = () => {
        AuthorizationServiceConfiguration.fetchFromIssuer(environment.openIdConnectUrl, new FetchRequestor())
            .then((response) => {
                const authRequest = new AuthorizationRequest({
                    client_id: environment.clientId,
                    redirect_uri: environment.redirectURL,
                    scope: 'openid profile',
                    response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
                    state: undefined,
                });
                authorizationHandler.performAuthorizationRequest(response, authRequest);
            })
            .catch(error => {
                setError(error);
            });
    };

    return <Paper className={classes.root} variant="outlined">
        <Button color="primary" variant="contained" onClick={redirect}>
            Sign In
        </Button>
        { error ? error : "" }
    </Paper>;
};

export default SignIn;
