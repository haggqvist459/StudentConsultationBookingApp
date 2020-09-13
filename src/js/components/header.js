import React, { useState, useContext, useCallback } from 'react';
import { Redirect } from 'react-router';
import '../../sass/index.scss';
import { Button, Typography, makeStyles, Grid, Link } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { AuthContext, firebase, routingConstants } from '../utils';
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


const Header = function ({ history }) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    // const [currentUser, setCurrentUser] = useState(null);
    const { currentUser } = useContext(AuthContext);
    
    const open = Boolean(anchorEl);


    const handleSignOut = () => {
        firebase.auth().signOut()
        setAnchorEl(null);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile2 = () => {
        setAnchorEl(null);
        return <Redirect to={'/profile'} />;
    }

    const handleProfile = useCallback(async event => {
        event.preventDefault();
        setAnchorEl(null);

        try {
            history.push(routingConstants.PROFILE); // switch /profile to the constant
        } catch (error) {
            alert(error);
        }

    }, [history]);

    const handleClick = useCallback(async event => {
        event.preventDefault();

        try {
            history.push('/profile'); // switch /profile to the constant
        } catch (error) {
            alert(error);
        }

    }, [history]);

    return (
        <Grid className={classes.root}>
            <Grid className="header" container justify={"space-between"}>
                <img src={LogoImage} alt="logo-image" className="header__image" />
                {currentUser ?
                    <>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle style={{ fontSize: 40 }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                            <Link href={routingConstants.Profile}>
                                <Typography>
                                    Profile
                                </Typography>
                            </Link>
                            </MenuItem>
                            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                        </Menu>
                    </>
                    :
                    <>
                    </>
                }

            </Grid>
        </Grid>
    );
}


export { Header };