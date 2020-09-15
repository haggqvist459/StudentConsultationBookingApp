import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { HomeWithRouter, ProfileWithRouter, AdminProfileWithRouter } from './js/pages';
import { SignInWithRouter } from './js/components/signIn';
import { PrivateRoute, routingConstants } from './js/utils';
import { AuthContext } from './js/utils/authProvider';
import { Grid } from '@material-ui/core';

function App() {



  return (
    <Grid>
      <BrowserRouter>
        <Route exact path="/" component={SignInWithRouter}/>
        <PrivateRoute path={routingConstants.HOME} component={HomeWithRouter} />
        <PrivateRoute path={routingConstants.PROFILE} component={ProfileWithRouter} />
        <PrivateRoute path={'/admin'} component={AdminProfileWithRouter} />

      </BrowserRouter>

    </Grid>
  );
}

export default App;
