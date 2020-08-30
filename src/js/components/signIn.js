import React, { useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { routingConstants, firebase, AuthContext } from '../utils';
import { Redirect } from 'react-router';
import { Grid, Typography, Button } from '@material-ui/core';
import { Header } from '../components';


const provider = new firebase.auth.GoogleAuthProvider();

const SignIn = function ({ history }) {

    const handleLoginSydney = useCallback(
        async event => {
            event.preventDefault();
            try {
                provider.setCustomParameters({
                    hd: "ait.edu.au"
                });
                firebase.auth().signInWithPopup(provider)
                .then(() => {
                    history.push(routingConstants.HOME); 
                })
            } catch (error) {
                console.log(error);
            }
        },
        [history]
    );

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to={routingConstants.HOME} />; // whatever the home page path is
    }

    return (
        <Grid>
            <Grid className='header'>
                <Header />
            </Grid>
            <Grid className='content'>
                {/* A sign in button here */}
                <Button onClick={handleLoginSydney}>Sign In </Button>
            </Grid>
        </Grid>
    )
}


export const SignInWithRouter = withRouter(SignIn);
