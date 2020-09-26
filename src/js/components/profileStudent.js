import React, { useContext, useState, useEffect } from 'react';
import { Grid, Typography, styled, Button, CircularProgress } from '@material-ui/core';
import { AuthContext, DESIGN, teacherServices, studentServices } from '../utils';

const RedButton = styled(Button)({
    background: DESIGN.BUTTON_RED,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.HOVER_BLUE,
    }
});


const Profile = function ({ history }) {

    const { currentUser } = useContext(AuthContext);

    const [state, setState] = useState({
        uiState: {
            mounted: false,
            refreshing: false,
        },
        data: {
            consultations: {
                pending: null,
                approved: null,
            }
        }
    })

    function buttonClick({ action, consul }) {
        switch (action) {
            case 'cancel':
                // cancel and send email notification
                console.log('cancel consultation')
                consul.booked = false;
                consul.confirmed = false;
                consul.topic = 'none';
                consul.student = 'none';
                break;
            default:
                break;
        }

        localStorage.setItem('CURRENT SLOT', JSON.stringify(consul));
        updateConsultation();
    }

    async function updateConsultation() {
        await teacherServices.updateConsultation().then(function () {
            setState({
                ...state,
                uiState: {
                    ...state.uiState,
                    refreshing: true,
                }
            })
        });
    }

    useEffect(() => {

        async function getSubjects() {
            await studentServices.studentSubjects({ email: currentUser.email }).then(function () {
                console.log('updated student subjects');
            })
        }

        if (state.uiState.refreshing) {
            getSubjects().then(function () {
                setState({
                    ...state,
                    uiState: {
                        ...state.uiState,
                        mounted: false,
                        refreshing: false,
                    }
                })
            })
        }

        if (!state.uiState.mounted) {

            getSubjects().then(function () {
                let consultations = JSON.parse(localStorage.getItem('CONSULTATIONS'));
                let pending = [];
                let approved = [];
    
                if (consultations) {
    
                    consultations.forEach((item) => {
                        if (item.booked) {
                            pending.push(item);
                        }
                        else {
                            approved.push(item);
                        }
                    })
    
                    setState({
                        ...state,
                        uiState: {
                            ...state.uiState,
                            mounted: true,
                        },
                        data: {
                            ...state.data,
                            consultations: {
                                pending: pending,
                                approved: approved,
                            }
                        }
                    })
                }
            })
        }

    }, [state]);

    return (
        <Grid container className='content' justify="center" alignItems="center">
            {/* A sign in button here */}
            <Grid container item xs={12} sm={12} md={12} lg={12} justify={"space-around"} alignItems={"center"}>
                <Grid container direction="column" justify={"center"} alignItems={"center"}>
                    <Grid container direction="row" justify={"center"} alignItems={"center"}>
                        <Typography variant="h4">
                            {currentUser.displayName}
                        </Typography>
                    </Grid>
                    <br />
                    <Typography variant="h5">Pending appointments: </Typography>
                    {state.data.consultations.pending && state.data.consultations.pending ?
                        <Grid>
                            {state.data.consultations.pending.map((item, index) => {
                                return (
                                    <Grid key={index}>
                                        <Consultation consultation={item} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        :
                        <Typography>
                            No pending appointments
                        </Typography>
                    }

                    <Typography variant="h5">Upcoming appointments: </Typography>
                    {state.data.consultations.approved && state.data.consultations.approved ?
                        <Grid>
                            {state.data.consultations.approved.map((item, index) => {
                                return (
                                    <Grid key={index}>
                                        <Consultation consultation={item} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        :
                        <Typography>
                            No upcoming appointments
                        </Typography>
                    }
                </Grid>
            </Grid>
        </Grid>
    )

    function Consultation({ consultation }) {
        console.log('consul: ', consultation);
        return (
            <Grid container direction={'row'} justify={'center'} style={{ marginTop: '30px' }}>
                {state.uiState.consultationLoading && state.uiState.consultationLoading ?
                    <CircularProgress />
                    :
                    <Grid>
                        <Grid container direction={'row'} justify={'center'}>
                            <Typography> Subject: {consultation.subject}</Typography>

                        </Grid>

                        <Grid container direction={'row'} justify={'center'}>
                            <Typography> {consultation.date} at: {consultation.starting}:{consultation.ending}</Typography>
                        </Grid>

                        <Grid container direction={'row'} justify={'center'}>
                            <RedButton onClick={() => buttonClick({ action: 'cancel', consul: consultation })}>
                                Cancel
                            </RedButton>
                        </Grid>
                    </Grid>
                }
            </Grid>
        )
    }
}

export default Profile;
