import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { Grid, Typography, styled, Button } from '@material-ui/core';
import { ArrowBack, Check } from '@material-ui/icons';
import { RouterHeader, Calendar, StudentTopics } from '../components';
import { studentServices, AuthContext, ROLE_CONSTANTS, teacherServices, DESIGN } from '../utils';

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

const Home = function ({ history }) {

    const [state, setState] = useState({
        uiState: {
            mounted: false,
            showTopics: false,
            bookingReady: false,
            calendarLoading: true,
            bookingLoading: false,
            bookConsultation: false,
            currentTopic: null,
            currentSlot: null,
        },
        data: {
            topicsList: null,
            calendarContent: [],
            user: {
                role: null,
                currentUser: null,
            },
        },
        serviceResponse: {
            bookingResponse: null,
        },

    })

    const { currentUserRole } = useContext(AuthContext);
    const { currentUser } = useContext(AuthContext);

    //click to profile page
    function handleClick() {
        console.log('role: ', currentUserRole);

        try {
            switch (currentUserRole) {
                case ROLE_CONSTANTS.STUDENT:
                    history.push({
                        pathname: '/profile',
                    })
                    break;
                case ROLE_CONSTANTS.TEACHER:
                    // for some reason, using state variables here like state.data.courseList 
                    // or state.data.calendarContent returns empty list in state location on teacher profile...
                    // using localstorage instead
                    history.push({
                        pathname: '/profile',
                        //state: { courses: courseList }
                    })
                    break;
                case ROLE_CONSTANTS.ADMIN:
                    history.push({
                        pathname: '/profile',
                    })
                    break;

                default:
                    break;
            }
        } catch (error) {
            alert(error);
        }
    };

    function studentCalendarClick() {
        console.log('home triggered');
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                showTopics: true,
                bookingReady: false,
                currentSlot: JSON.parse(localStorage.getItem('CURRENT SLOT')),
            }
        })
    }

    function topicClick() {
        console.log('topic selected');
        setState({
            ...state,
            uiState: {
                ...state.uiState,
                showTopics: false,
                bookingReady: true,
                currentTopic: JSON.parse(localStorage.getItem('CURRENT TOPIC')),
            }
        })
    }

    function buttonClick({ action }) {
        switch (action) {
            case 'book':
                setState({
                    ...state,
                    uiState: {
                        ...state.uiState,
                        showTopics: false,
                        bookingReady: false,
                        bookingLoading: true,
                        bookConsultation: true,
                    }
                })
                break;
            case 'return':
                setState({
                    ...state,
                    uiState: {
                        ...state.uiState,
                        showTopics: true,
                        bookingReady: false,
                    }
                })
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        console.log('current user: ', currentUser );

        async function bookConsultation() {
            setState({
                ...state,
                uiState: {  
                    ...state.uiState,
                    bookConsultation: false,
                },
                servicesResponse: {
                    ...state.servicesResponse,
                    bookingResponse: await studentServices.bookConsultation(),
                }
            })
        }

        async function fetchCalendarContent() {
            switch (currentUserRole) {
                case ROLE_CONSTANTS.STUDENT:
                    setState({
                        ...state,
                        uiState: {
                            ...state.uiState,
                            mounted: true,
                            calendarLoading: false,
                        },
                        data: {
                            ...state.data,
                            calendarContent: await studentServices.studentSubjects({ email: currentUser.email }),
                            topicsList: await studentServices.studentTopics(),
                        }
                    })
                    console.log('student subjects finished state')
                    break;
                case ROLE_CONSTANTS.TEACHER:
                    let subjects = await teacherServices.teacherSubjects({ email: currentUser.email });
                    
                    // subjects.forEach((item, index) => {
                    //     courseList.push(item);
                    // })
                    setState({
                        ...state,
                        uiState: {
                            ...state.uiState,
                            mounted: true,
                            calendarLoading: false,
                        },
                        data: {
                            ...state.data,
                            calendarContent: subjects,
                        }
                    })
                    localStorage.setItem('TEACHER SUBJECTS', JSON.stringify(subjects));
                    console.log('teacher subjects finished state')
                    break;
                case ROLE_CONSTANTS.ADMIN:
                    setState({
                        ...state,
                        uiState: {
                            ...state.uiState,
                            mounted: true,
                            calendarLoading: false,
                        },
                        data: {
                            ...state.data,
                            calendarContent: await studentServices.studentSubjects({ email: currentUser.email }),
                            topicsList: await studentServices.studentTopics(),
                        }
                    })
                    console.log('admin subjects finished state')
                    break;

                default:
                    break;
            }
        }

        if (!state.uiState.mounted) {
            fetchCalendarContent();
        }
        if (state.uiState.bookConsultation) {
            bookConsultation();
        }

    }, [state]) 

    return (
        <Grid>
            <Grid className='RouterHeader'> <RouterHeader onClick={handleClick} link={'Profile'} /> </Grid>

            <Grid className='content'>

                <Grid>
                    {state.uiState.calendarLoading ?
                        <Typography>Loading calendar... </Typography>
                        :
                        <Calendar content={state.data.calendarContent} studentClick={studentCalendarClick} />
                    }
                </Grid>

                <Grid container justify={'center'} style={{ minHeight: '150px' }}>
                    {state.uiState.showTopics ?
                        <Grid container direction={'row'} justify={'space-around'} item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <StudentTopics topics={state.data.topicsList} onSelect={topicClick} />
                        </Grid>
                        :
                        null
                    }
                </Grid>


                <Grid container justify={'center'} style={{ minHeight: '150px' }}>
                    {state.uiState.bookingReady ?
                        <Grid container direction={'row'} justify={'space-evenly'} item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ToolButton
                                startIcon={<ArrowBack />}
                                onClick={() => buttonClick({ action: 'return' })}>
                                Return
                            </ToolButton>

                            <Grid container direction={'column'} alignContent={'center'} item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Typography>{state.uiState.currentTopic.topic}</Typography>
                                <Typography>{state.uiState.currentSlot.course.longName}</Typography>
                            </Grid>
        
                            <ToolButton
                                endIcon={<Check />}
                                onClick={() => buttonClick({ action: 'book' })}>
                                Book
                            </ToolButton>
                        </Grid>
                        :
                        null
                    }
                </Grid>

                <Grid container justify={'center'} style={{ minHeight: '150px'}}>
                    {state.serviceResponse.bookingResponse && state.serviceResponse.bookingResponse ?
                    <Grid>
                        <Typography>{state.serviceResponse.bookingResponse}</Typography>
                    </Grid>
                    :
                    null
                    }
                </Grid>

            </Grid>
        </Grid>
    )
}


export const HomeWithRouter = withRouter(Home);
