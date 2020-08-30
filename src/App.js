import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { HomeWithRouter, ProfileWithRouter } from './js/pages';
import { PrivateRoute, routingConstants } from './js/utils';
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
              <Redirect to={routingConstants.HOME} /> 
            )
          }}
        />

        <Route exact path={routingConstants.HOME} component={HomeWithRouter} />
        <PrivateRoute path={routingConstants.PROFILE} component={ProfileWithRouter} />

      </BrowserRouter>

    </Grid>
  );
}

export default App;
