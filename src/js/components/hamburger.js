import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HamburgerMenu from 'react-hamburger-menu';
import clsx from 'clsx';
import { List, Menu, withStyles, makeStyles, Grid, Typography, IconButton, Icon } from '@material-ui/core'
import { AccountCircle, Home } from '@material-ui/icons';

import { hamburgerActions } from '../actions';
import { hamburgerConstants } from '../utils';

const useStyles = makeStyles({
    // list: {
    //   width: 250,
    // },
    // fullList: {
    //   width: 'auto',
    // },
    link: {
        textDecoration: "none",
        color: "#101820",
        fontWeight: "bold",
    },
    menuButton: {
        color: "white",
    },
    drawer: {
        height: "calc(100% - 15vh",
        top: "15vh",
    },

});

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #101820',
        marginTop: "5px",
        // backgroundColor: "transparent",
    },
})((props) => (
    <Menu
        elevation={5}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

function Hamburger( {history}) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({
        left: false
    });

    const { auth } = useSelector(state => state.auth);
    const { activeLink } = useSelector(state => state.hamburger)
    useEffect(() => { }, [auth, activeLink]);

    //drawer stuff, not in use
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setHamburgerOpen(!hamburgerOpen);
    };

    const handleClose = () => {
        setAnchorEl(null);
        if (hamburgerOpen) {
            setHamburgerOpen(false)
        } else {
            setHamburgerOpen(true)
        }
    };

    function handleNavigation(link) {
        dispatch(hamburgerActions.burgerTap(link))
        history.push(link);
    }



    const list = (anchor) => (
        <Grid
            className={clsx(classes.list, {
                [classes.fullList]: anchor === "top" || anchor === "bottom"
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>

                {activeLink === hamburgerConstants.HOME ?
                    <Grid>
                        <IconButton onClick={() => handleNavigation(hamburgerConstants.PROFILE)}>
                            <Icon>
                                <AccountCircle fontSize="large" color="primary" />
                            </Icon>
                            <Typography>profile</Typography>
                        </IconButton>
                    </Grid>
                    :
                    <Grid>
                        <IconButton onClick={() => handleNavigation(hamburgerConstants.HOME)}>
                            <Icon>
                                <Home fontSize="large" color="primary" />
                            </Icon>
                            <Typography>home</Typography>
                        </IconButton>
                    </Grid>
                }
               
            </List>
        </Grid>
    );


    return (
        <Grid>
            <Grid>
                {["left"].map(anchor => (
                    <Grid key={anchor}>
                        <HamburgerMenu
                            width={32}
                            height={24}
                            strokeWidth={3}
                            rotate={0}
                            color="white"
                            borderRadius={0}
                            isOpen={hamburgerOpen}
                            // menuClicked={toggleDrawer(anchor, true)}
                            menuClicked={handleClick}
                        />
                        <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            className={classes.Menu}
                        >

                            {list(anchor)}
                        </StyledMenu>


                        {/* <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              classes={{ docked: moreClasses.paper }}
            >

            </Drawer> */}
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}


const HistoryHamburger = withRouter(Hamburger);

export { HistoryHamburger };