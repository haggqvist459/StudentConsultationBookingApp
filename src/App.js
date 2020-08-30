import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { HomeWithRouter, Profile } from './js/pages';
import { PrivateRoute, hamburgerConstants } from './js/utils';
import { Grid } from '@material-ui/core';

function App() {
  return (
    <Grid>

      <BrowserRouter>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <Redirect to={hamburgerConstants.HOME} /> 
            )
          }}
        />

        <Route exact path={hamburgerConstants.HOME} component={HomeWithRouter} />
        <PrivateRoute path={hamburgerConstants.PROFILE} component={Profile} />

      </BrowserRouter>

    </Grid>
  );
}

export default App;
