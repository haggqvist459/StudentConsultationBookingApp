import React, { useState } from 'react';
import { Grid, Typography, Button, styled, Radio, FormControl, FormControlLabel, RadioGroup, withStyles } from '@material-ui/core';
import { DESIGN } from '../utils';
import PropTypes from 'prop-types'
import DatePicker from "react-datepicker";
import moment from 'moment';

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

const BlueRadio = withStyles({
    root: {
        color: DESIGN.PRIMARY_COLOR,
        '&$checked': {
            color: DESIGN.PRIMARY_COLOR,
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

function TeacherSubject({ subject, updateSubject }) {
    console.log(subject);
    console.log('teacher subject')

    function AssignedDayAndTime() {

        const [value, setValue] = useState(null);
        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());
    
        const handleRadioChange = (event) => {
            setValue(event.target.value);
        };
        
        const handleSubmit = (event) => {
            event.preventDefault();
            let day = parseInt(value);
            day++;
            subject.daysOfWeek = day;
            subject.startTime = moment(startDate.getTime()).format('HH:mm');
            subject.endTime = moment(endDate.getTime()).format('HH:mm');
            localStorage.setItem('CURRENT UPDATE', JSON.stringify(subject))
            updateSubject();
        };
    
        return (
            <form onSubmit={handleSubmit}>
                <Grid container direction={'row'} justify={'space-evenly'}>
    
                    <Grid container direction={'row'} item xs={10} sm={10} md={10} lg={10} xl={10} justify={'center'}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="consulDay" name="consulDay" value={value} onChange={handleRadioChange}>
                                <Grid container direction={'row'}>
                                    <FormControlLabel value="0" control={<BlueRadio />} label="Monday" />
                                    <FormControlLabel value="1" control={<BlueRadio />} label="Tuesday" />
                                    <FormControlLabel value="2" control={<BlueRadio />} label="Wednesday" />
                                    <FormControlLabel value="3" control={<BlueRadio />} label="Thursday" />
                                    <FormControlLabel value="4" control={<BlueRadio />} label="Friday" />
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
    
                    <Grid container direction={'row'} item xs={10} sm={10} md={10} lg={10} xl={10} justify={'space-around'} style={{ marginTop: '30px' }}>
                        <Grid>
                            <Typography>Starting time</Typography>
                            <DatePicker
                                selected={startDate}
                                onChange={time => setStartDate(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Start"
                                dateFormat="h:mm aa"
                            />
                        </Grid>
    
                        <Grid>
                            <Typography>Ending time</Typography>
                            <DatePicker
                                selected={endDate}
                                onChange={time => setEndDate(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="End"
                                dateFormat="h:mm aa"
                            />
                        </Grid>
                    </Grid>
                </Grid>
    
                <Grid container direction={'row'} justify={'center'} style={{ marginTop: '30px' }}>
    
                    {value && value ?
                        <ToolButton type="submit">
                            Save
                    </ToolButton>
                        :
                        <ToolButton disabled>
                            Save
                    </ToolButton>
                    }
    
                </Grid>
            </form>
        );
    }

    return (
        <Grid container direction={'row'} justify={'space-evenly'}>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                <Grid container direction={'row'} justify={'space-evenly'} item xs={12} sm={12} md={12} lg={12} xl={12}>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginBottom: '70px' }}>

                        <Grid container direction={'row'} justify={'center'} style={{ marginTop: '10px', marginBottom: '20px' }}>
                            <Typography>{subject.longName}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <AssignedDayAndTime />
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>


        </Grid>
    )
}

TeacherSubject.propTypes = {
    subject: PropTypes.object.isRequired,
    updateSubject: PropTypes.func.isRequired,
}

export { TeacherSubject }