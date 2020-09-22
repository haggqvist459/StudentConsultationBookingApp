import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { HomeWithRouter, ProfileWithRouter } from './js/pages';
import { SignInWithRouter } from './js/components/signIn';
import { PrivateRoute, ROUTING_CONSTANTS } from './js/utils';
import { Grid } from '@material-ui/core';

function App() {



  return (
    <Grid>
      <BrowserRouter>
        <Route exact path="/" component={SignInWithRouter}/>
        <PrivateRoute path={ROUTING_CONSTANTS.HOME} component={HomeWithRouter} />
        <PrivateRoute path={ROUTING_CONSTANTS.PROFILE} component={ProfileWithRouter} />
      </BrowserRouter>

    </Grid>
  );
}

export default App;
