import React from 'react';
import '../../sass/index.scss';
import { Button, Typography, Toolbar, AppBar, makeStyles, Grid } from '@material-ui/core';
import { AuthProvider, firebase } from '../utils';
import LogoImage from '../../assets/aitlogowhite.png'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: "2vmin",
        height: "5vh",
        marginTop: "5vh",
    },
    title: {
        flexGrow: 1,
    },

}));

function Header() {

    const classes = useStyles();

    const handleSignOut = () => {
        firebase.auth().signOut()
    }

    return (
        <Grid className={classes.root}>
            <Grid className="header" container justify={"space-between"}>
                <img src={LogoImage} alt="logo-image" className="header__image"/>
                <Button variant="outlined" className={classes.menuButton} color="inherit" onClick={handleSignOut}>
                    <Typography>Sign out</Typography>
                </Button>
            </Grid>
        </Grid>
    );
}


export { Header };