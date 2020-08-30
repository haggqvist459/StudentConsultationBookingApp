import React from 'react';
import '../../sass/index.scss';
import { Button, Typography, Toolbar, AppBar, makeStyles, Grid } from '@material-ui/core';
import { AuthProvider, firebase } from '../utils';

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

    const handleSignOut = () =>{
        firebase.auth().signOut()
    }

    return (
        <Grid className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Grid container justify={"space-between"}>

                        <Grid>
                            <Grid container justify={"space-around"} alignContent={'center'}>
                                <Typography style={{ marginLeft: '3vmin' }}>
                                    {AuthProvider.currentUser}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Button color="inherit" onClick={handleSignOut}>
                            <Typography>Sign out</Typography>
                        </Button>
                    </Grid>

                </Toolbar>
            </AppBar>
        </Grid>
    );
}


export { Header };