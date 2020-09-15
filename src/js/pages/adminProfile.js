import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router';
import { Grid, Typography, Button, styled } from '@material-ui/core';
import { Header, AddTerm } from '../components';
import "react-datepicker/dist/react-datepicker.css";
import { adminServices, design } from '../utils';


const ToolButton = styled(Button)({
    background: design.PRIMARY_COLOR,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: design.PRIMARY_COLOR,
    }
});


function AdminProfile() {

    const [currentTerm, setCurrentTerm] = useState(false);
    const [loadingTerm, setLoadingTerm] = useState();
    const [activeComponent, setActiveComponent] = useState();

    async function termCheck() {
        setLoadingTerm(true)
        setCurrentTerm(await adminServices.checkCurrentTerm());
        setLoadingTerm(false)
    }

    useEffect(() => {

        // check if there is a current term 
        termCheck();

    }, [currentTerm])

    function ViewTerm() {
        return (

            <Grid>

            </Grid>
        )
    }

    function TopicList() {
        return (
            <Typography>topic list</Typography>
        )
    }

    function handleToolClick(tool) {
        setActiveComponent(tool);
    }

    function ActiveComponent() {
        switch (activeComponent) {

            case 'viewTerm':
                return <ViewTerm />

            case 'addTerm':
                return <AddTerm />

            case 'topics':
                return <TopicList />

            default:
                return null;
        }
    }

    return (
        <Grid>

            <Grid className='header'> <Header /> </Grid>

            <Grid container direction={'row'} justify={'center'} style={{ marginTop: '20px' }}>
                <Typography>AIT student consultation admin</Typography>
            </Grid>

            <Grid container direction={'row'} style={{ marginTop: '20px' }}>

                <Grid container direction={'column'} alignItems={'flex-start'} item xs={12} sm={12} md={3} lg={3} xl={3} style={{ marginTop: '40px' }}>
                    {loadingTerm ?
                        <ToolButton>loading</ToolButton>
                        :
                        <Grid>
                            {currentTerm && currentTerm ?
                                <ToolButton onClick={() => handleToolClick('viewTerm')}>view term</ToolButton>
                                :
                                <ToolButton onClick={() => handleToolClick('addTerm')}>add term</ToolButton>
                            }
                        </Grid>
                    }
                    <ToolButton onClick={() => handleToolClick('topics')}>topics</ToolButton>
                </Grid>

                <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: '40px' }}>
                    <ActiveComponent />
                </Grid>



            </Grid>

        </Grid>
    )
}




export const AdminProfileWithRouter = withRouter(AdminProfile);
