import React, { useState } from 'react'
import { Grid, Typography, CircularProgress, TextField } from '@material-ui/core';
import { TOOL_BUTTON, DESIGN, adminServices } from '../utils';
import { IconButton, Button, styled, GridList, makeStyles } from '@material-ui/core';
import { Edit, ArrowBack, ArrowForward, Delete } from '@material-ui/icons';
import PropTypes from 'prop-types'

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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '80vw',
        height: '20vh',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    topicField: {
        cssLabel: {
            color: 'green'
        },
        outline: {
            borderWidth: '1px',
            borderColor: '#00AEB3 !important'
        },
    }
}));

function Topics({ topics, updateList }) {

    const classes = useStyles();
    const [topicUiState, setTopicUiState] = useState({
        topicAction: null,
        topic: null,
        topicRef: null,
        loading: false,
        serviceResponse: null,
    })

    async function saveTopic() {

        try {
            setTopicUiState({
                ...topicUiState,
                loading: true,
                serviceResponse: await adminServices.newTopic({ topic: topicUiState.topic })
            })
        } catch (error) {
            console.log(error)
            console.log('failed to store ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }

        if (topicUiState.serviceResponse === 'failed to store') {
            console.log('failed to store ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        else {
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        updateList();
    }

    async function updateTopicData() {

        try {
            setTopicUiState({
                ...topicUiState,
                loading: true,
                serviceResponse: await adminServices.updateTopic({ topicRef: topicUiState.topicRef, topic: topicUiState.topic })
            })
        } catch (error) {
            console.log(error)
            console.log('failed to update ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }

        if (topicUiState.serviceResponse === 'failed to update') {
            console.log('failed to update ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        else {
            console.log('update finished ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        updateList();
    }

    async function deleteTopic({ topicRef }) {

        console.log('delete: ', topicRef)
        try {
            setTopicUiState({
                ...topicUiState,
                loading: true,
                serviceResponse: await adminServices.deleteTopic({ topicRef: topicRef })
            })
        } catch (error) {
            console.log(error)
            console.log('failed to update ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }

        if (topicUiState.serviceResponse === 'failed to update') {
            console.log('failed to update ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        else {
            console.log('delete win ', topicUiState.topic)
            setTopicUiState({
                ...topicUiState,
                loading: false,
            })
        }
        updateList();
    }

    function List({ data }) {

        return (
            <GridList cellHeight={20} className={classes.gridList} cols={1}>
                {data.map((topic, index) => (
                    <Grid container direction={'row'} justify={'space-between'} key={index} style={{ margin: '15px' }}>
                        <Grid container item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Typography>{topic.topic}</Typography>
                        </Grid>

                        <Grid container justify={'flex-end'} item xs={2} sm={2} md={2} lg={2} xl={2}>
                            {topicUiState.topicAction !== TOOL_BUTTON.EDIT ?
                                <IconButton onClick={() => onClick({ type: TOOL_BUTTON.EDIT, topic: topic, topicRef: topic.id })}>
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton disabled>
                                    <Edit />
                                </IconButton>
                            }
                        </Grid>

                    </Grid>
                ))}
            </GridList>
        )
    }

    function onClick({ type, topic, topicRef }) {
        switch (type) {
            case TOOL_BUTTON.NEW:
                setTopicUiState({
                    ...topicUiState,
                    topicAction: TOOL_BUTTON.NEW,
                    topic: null,
                })
                break;
            case TOOL_BUTTON.EDIT:
                console.log(topic)
                setTopicUiState({
                    ...topicUiState,
                    topicAction: TOOL_BUTTON.EDIT,
                    topicRef: topicRef,
                    topic: topic,
                })
                break;
            case TOOL_BUTTON.SAVE:
                saveTopic();
                break;
            case TOOL_BUTTON.DELETE:
                deleteTopic({ topicRef: topicRef });
                break;
            case TOOL_BUTTON.UPDATE:
                updateTopicData();
                break;
            case TOOL_BUTTON.RETURN:
                setTopicUiState({
                    ...topicUiState,
                    topicAction: TOOL_BUTTON.RETURN,
                    topic: null,
                })
                break;
            default:
                break;
        }
    }

    const handleChange = (prop) => (event) => {
        setTopicUiState({
            ...topicUiState,
            topic: event.target.value
        });
    };

    const handleUpdate = (prop) => (event) => {
        setTopicUiState({
            ...topicUiState,
            topic: {
                ...topicUiState.topic,
                topic: event.target.value
            },
        });
    };


    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

            <Grid container justify={'center'} style={{ marginBottom: '30px' }}>
                <Typography>Consultation Topics</Typography>
            </Grid>
            {topics ?
                <Grid className={classes.root}>
                    {topics && topics.length > 0 ?
                        <List data={topics} />
                        :
                        <Grid>
                            <Typography>No topics found</Typography>
                        </Grid>
                    }
                    {!topicUiState.topicAction || topicUiState.topicAction === TOOL_BUTTON.RETURN ?
                        <BlueButton
                            type={TOOL_BUTTON.NEW}
                            onClick={() => onClick({ type: TOOL_BUTTON.NEW, topic: null })}
                            style={{ marginTop: '30px' }}
                        >
                            New
                            </BlueButton>
                        :
                        null
                    }
                </Grid>
                :
                <CircularProgress />
            }

            {topicUiState.topicAction && topicUiState.topicAction === TOOL_BUTTON.EDIT ?
                <Grid>
                    <Grid container justify={'center'}>
                        <TextField
                            variant="outlined"
                            name="topic"
                            required id="standard-required topic"
                            defaultValue={topicUiState.topic.topic}
                            onChange={handleUpdate(topicUiState.topic.topic)}
                            InputLabelProps={{
                                classes: {
                                    root: classes.topicField.cssLabel,
                                    outline: classes.topicField.outline,
                                },
                            }}
                            style={{ marginTop: '30px' }}
                        />
                    </Grid>
                    <Grid container direction={'row'} justify={'center'}>
                        <Grid container direction={'row'} justify={'space-evenly'} item xs={10} sm={10} md={12} lg={12} xl={12} style={{ marginTop: '60px' }}>
                            <Grid container direction={'row'} justify={'center'} item xs={8} sm={8} md={3} lg={3} xl={3}>
                                {topicUiState.loading ?
                                    <BlueButton
                                        disabled
                                        startIcon={<ArrowBack />}
                                    >
                                        Return
                            </BlueButton>
                                    :
                                    <BlueButton
                                        type={TOOL_BUTTON.RETURN}
                                        onClick={() => onClick({ type: TOOL_BUTTON.RETURN, topic: topicUiState.topic })}
                                        startIcon={<ArrowBack />}
                                    >
                                        Return
                            </BlueButton>
                                }

                            </Grid>
                            <Grid container direction={'row'} justify={'center'} item xs={8} sm={8} md={3} lg={3} xl={3}>
                                {topicUiState.loading ?
                                    <BlueButton disabled>
                                        Saving..
                            </BlueButton>
                                    :
                                    <BlueButton
                                        type={TOOL_BUTTON.UPDATE}
                                        onClick={() => onClick({ type: TOOL_BUTTON.UPDATE, topic: topicUiState.topic })}>
                                        Save
                            </BlueButton>
                                }

                            </Grid>
                            <Grid container direction={'row'} justify={'center'} item xs={8} sm={8} md={3} lg={3} xl={3}>
                                {topicUiState.loading ?
                                    <RedButton disabled endIcon={<Delete />}>
                                        Delete
                                    </RedButton>
                                    :
                                    <RedButton
                                        type={TOOL_BUTTON.DELETE}
                                        onClick={() => onClick({ type: TOOL_BUTTON.DELETE, topicRef: topicUiState.topicRef })}
                                        endIcon={<Delete />}>
                                        Delete
                                    </RedButton>
                                }

                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                :
                null
            }

            {topicUiState.topicAction === TOOL_BUTTON.NEW ?
                <Grid container direction={'row'} justify={'center'} style={{ marginTop: '30px' }}>
                    <Grid container direction={'row'} justify={'center'}>
                        <Grid container direction={'column'} alignContent={'center'} item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <TextField
                                variant="outlined"
                                name="topic"
                                required id="standard-required topic"
                                defaultValue={topicUiState.topic}
                                onChange={handleChange(topicUiState.topic)}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.topicField.cssLabel,
                                        outline: classes.topicField.outline,
                                    },
                                }}
                                style={{ marginBottom: '30px' }}
                            />

                            {topicUiState.topic && topicUiState.topic ?
                                <BlueButton
                                    type={TOOL_BUTTON.SAVE}
                                    onClick={() => onClick({ type: TOOL_BUTTON.SAVE, topic: topicUiState.topic })}>
                                    Save
                            </BlueButton>
                                :
                                <BlueButton
                                    disabled>
                                    Save
                            </BlueButton>
                            }

                            <BlueButton
                                type={TOOL_BUTTON.RETURN}
                                onClick={() => onClick({ type: TOOL_BUTTON.RETURN, topic: topicUiState.topic })}
                                startIcon={<ArrowBack />}
                            >
                                Return
                            </BlueButton>
                        </Grid>
                    </Grid>
                </Grid>
                :
                null
            }
        </Grid>
    )
}

Topics.propTypes = {
    topics: PropTypes.array,
    updateList: PropTypes.func,
}

function StudentTopics({ topics, onSelect }) {

    const classes = useStyles();
    const [selected, setSelected] = useState(false);

    function onClick({ topic }) {
        console.log('topic ', topic);
        localStorage.setItem('CURRENT TOPIC', JSON.stringify(topic))
        setSelected(true);
        onSelect();
    }

    function List({ data }) {

        return (
            <GridList cellHeight={20} className={classes.gridList} cols={1}>
                {data.map((topic, index) => (
                    <Grid container direction={'row'} justify={'space-between'} key={index} style={{ margin: '15px' }}>
                        <Grid container item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Typography>{topic.topic}</Typography>
                        </Grid>

                        <Grid container justify={'flex-end'} item xs={2} sm={2} md={2} lg={2} xl={2}>
                            {selected ?
                                <IconButton disabled>
                                    <ArrowForward />
                                </IconButton>
                                :
                                <IconButton onClick={() => onClick({ topic: topic })}>
                                    <ArrowForward />
                                </IconButton>
                            }
                        </Grid>
                    </Grid>
                ))}
            </GridList>
        )
    }


    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

            <Grid container justify={'center'} style={{ marginBottom: '30px' }}>
                <Typography>Choose a topic</Typography>
            </Grid>

            {topics ?
                <Grid className={classes.root}>
                    {topics && topics.length > 0 ?
                        <List data={topics} />
                        :
                        <Grid>
                            <Typography>No topics found</Typography>
                        </Grid>
                    }
                </Grid>
                :
                <CircularProgress />
            }

        </Grid>
    )
}

StudentTopics.propTypes = {
    topics: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
}

export { Topics, StudentTopics }