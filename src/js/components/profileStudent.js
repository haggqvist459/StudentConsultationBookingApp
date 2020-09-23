import React, { useContext, useState, useEffect } from 'react';
import { Grid, Typography, styled, Button } from '@material-ui/core';
import { AuthContext, DESIGN } from '../utils';


const BlueButton = styled(Button)({
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
        backgroundColor: DESIGN.PRIMARY_COLOR,
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

    function buttonClick({ action }) {
        switch (action) {
            case 'cancel':
                // cancel and send email notification
                console.log('cancel consultation')
                break;

            default:
                break;
        }
    }

    function PendingConsultation({ consultation }) {
        return (
            <Grid container direction={'row'} style={{ marginTop: '30px' }}>
                <Grid container direction={'row'} justify={'center'}>
                    <Typography> Subject: {consultation.subject} on: {consultation.date} between: {consultation.starting}:{consultation.ending}</Typography>

                </Grid>

                <Grid container direction={'row'} justify={'center'}>
                    <RedButton onClick={() => buttonClick({ action: 'cancel' })}>
                        Cancel
                </RedButton>
                </Grid>
            </Grid>
        )
    }

    function ApprovedConsultation({ consultation }) {
        return (
            <Grid container direction={'row'} style={{ marginTop: '30px' }}>
                <Typography> Subject: {consultation.subject} on: {consultation.date} between: {consultation.starting}:{consultation.ending}</Typography>
            </Grid>
        )
    }

    useEffect(() => {

        if (!state.uiState.mounted) {

            let consultations = JSON.parse(localStorage.getItem('CONSULTATIONS'));
            let pending = [];
            let approved = [];

            if (consultations) {

                consultations.forEach((item) => {
                    if (item.pending) {
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
                                        <PendingConsultation consultation={item} />
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
                                        <ApprovedConsultation consultation={item} />
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
}

export default Profile;

/*
            <Grid container direction="column">
                <h4>Pending appointments: </h4>
            </Grid>

*/