import React, { useEffect } from 'react';
import '../../sass/index.scss';
import { Button, Typography, Toolbar, AppBar, makeStyles, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../actions';
import { HistoryHamburger } from './hamburger';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Header() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { auth, user } = useSelector(state => state.auth);

    function handleLogin() {
        if (!auth) {
            dispatch(authActions.googleLogin());
        }
        else {
            dispatch(authActions.logout());
        }
    }

    useEffect(() => {

    }, [auth, user]);

    return (
        <Grid className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Grid container justify={"space-between"}>
                        {auth ?
                            <Grid>
                                <Grid container justify={"space-around"} alignContent={'center'}>
                                    <HistoryHamburger />
                                    <Typography style={{ marginLeft: '3vmin' }}>
                                        {user.displayName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            :
                            <Grid>
                                <Typography variant="h6" className={classes.title}>
                                    AIT Student Booking
                            </Typography>
                            </Grid>
                        }

                        <Button onClick={handleLogin} color="inherit">
                            {auth ? <Typography>Sign out</Typography> : <Typography>Sign in</Typography>}
                        </Button>
                    </Grid>

                </Toolbar>
            </AppBar>
        </Grid>
    );
}


export { Header };