import React, { useState, useEffect } from 'react'
import { Grid, Typography, Button, styled } from '@material-ui/core';
import { AddTerm, Topics } from '../components';
import "react-datepicker/dist/react-datepicker.css";
import { adminServices, DESIGN } from '../utils';


const ToolButton = styled(Button)({
    background: DESIGN.PRIMARY_COLOR,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.PRIMARY_COLOR,
    }
});

function Profile() {

    const [state, setState] = useState({
        uiState: {
            mounted: false,
            activeComponent: null,
            termsLoading: true,
            topicsLoading: true,
            topicsUpdate: false,
        },
        serviceResponse: {
            termData: null,
            topics: null,
        },
    })

    useEffect(() => {
        async function updateList() {
            console.log('admin profile updating topic list')
            setState({
                ...state,
                serviceResponse: {
                    ...state.serviceResponse,
                    topics: await adminServices.getTopics(),
                },
                uiState: {
                    ...state.uiState,
                    activeComponent: 'topics',
                    topicsLoading: false,
                    topicsUpdate: false,
                },
            })
        }

        async function initAdmin() {
            console.log('admin profile mounting')
            setState({
                ...state,
                uiState: {
                    ...state.uiState,
                    mounted: true,
                    termsLoading: false,
                    topicsLoading: false,
                },
                serviceResponse: {
                    termData: await adminServices.checkCurrentTerm(),
                    topics: await adminServices.getTopics(),
                }
            })
        }

        if (!state.uiState.mounted) {
            initAdmin();
        }
        if (state.uiState.topicsUpdate) {
            updateList();
        }
    }, [state])

    function handleToolClick(tool) {
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                activeComponent: tool,
            }
        })
    }

    function updateList() {
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                topicsUpdate: true,
                topicsLoading: true,
            }
        })
    }

    function ActiveComponent() {
        switch (state.uiState.activeComponent) {
            // view term not implemented !
            case 'viewTerm':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: '40px' }}>
                        <AddTerm />
                    </Grid>
                )

            case 'addTerm':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: '40px' }}>
                        <AddTerm />
                    </Grid>
                )
            case 'topics':
                return (
                    <Grid container direction={'row'} justify={'center'} item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: '40px' }}>
                        <Topics topics={state.serviceResponse.topics} updateList={updateList} />
                    </Grid>
                )
            default:
                return null;
        }
    }

    return (
        <Grid style={{ width: '100vw'}}>
            <Grid container direction={'row'} justify={'center'} style={{ marginTop: '20px' }}>
                <Typography>AIT student consultation admin</Typography>
            </Grid>

            <Grid container direction={'row'} style={{ marginTop: '20px' }}>

                <Grid container direction={'column'} alignItems={'flex-start'} item xs={12} sm={12} md={3} lg={3} xl={3} style={{ marginTop: '40px' }}>
                    {state.uiState.termsLoading ?
                        <ToolButton>loading</ToolButton>
                        :
                        <Grid>
                            {state.serviceResponse.termData && state.serviceResponse.termData ?
                                <ToolButton onClick={() => handleToolClick('viewTerm')}>upload</ToolButton>
                                :
                                <ToolButton onClick={() => handleToolClick('addTerm')}>upload</ToolButton>
                            }
                        </Grid>
                    }

                    {state.uiState.topicsLoading ?
                        <ToolButton>loading</ToolButton>
                        :
                        <ToolButton onClick={() => handleToolClick('topics')}>topics</ToolButton>
                    }
                </Grid>

                <ActiveComponent />

            </Grid>
        </Grid>
    )
}




export default Profile;
