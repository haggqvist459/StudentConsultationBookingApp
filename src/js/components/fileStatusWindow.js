import React, { useState } from 'react'
import { ICON_CONSTANTS, UI_TEXT, fileTypes } from '../utils';
import { Grid, Typography, Box } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, AddCircleOutline, HourglassEmpty } from '@material-ui/icons';

function FileStatus({ fileType }) {

    const [status, setStatus] = useState({
        fileType: fileType,
    })

    

    return (

        <Grid container justify={'center'} item xs={12} sm={12} md={12} lg={12} xl={12}>

           

        </Grid>
    )
}