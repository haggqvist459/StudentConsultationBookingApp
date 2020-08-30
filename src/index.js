import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, compose, createStore } from 'redux';
import { reduxFirestore, getFirestore, createFirestoreInstance } from 'redux-firestore';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './js/reducers/rootReducer';
import { firebase, responsiveTheme, AuthProvider } from './js/utils';
import { ThemeProvider } from '@material-ui/core';

import './sass/index.scss';
import App from './App';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware.withExtraArgument({ getFirestore, getFirebase })),
    reduxFirestore(firebase.firestore()),
  )
);

const profileSpecificProps = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableRedirectHandling: false,
  resetBeforeLogin: false
}

const rrfProps = {
  firebase,
  dispatch: store.dispatch,
  userProfile: 'users',
  presence: 'presence',
  sessions: 'sessions',
  config: profileSpecificProps,
  createFirestoreInstance
};


ReactDOM.render(

    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthProvider>
          <ThemeProvider theme={responsiveTheme}>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </ReactReduxFirebaseProvider>
    </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

