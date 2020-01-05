import React from 'react';
import { CssBaseline, Grid, Theme } from '@material-ui/core';
import { createMuiTheme, createStyles, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Profile from "./Profile";
import SignIn from "./SignIn";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh',
        },
    }),
);

const App: React.FC = () => {
  const darkTheme = createMuiTheme({palette: {type: 'dark'}});
  const classes = useStyles();
  const content = (window.location.pathname === '/callback')
                ? <Profile />
                : <SignIn />;

  return <ThemeProvider theme={darkTheme}>
    <CssBaseline />
      <div className={classes.root}>
        <Grid container
          className={classes.grow}
          direction="column"
          alignItems="center"
          justify="center"
        >
            <Grid item>

                { content }

            </Grid>
        </Grid>
      </div>
  </ThemeProvider>;
}

export default App;
