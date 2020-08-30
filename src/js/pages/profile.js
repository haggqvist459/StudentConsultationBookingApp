import React from 'react'
import { Grid, Typography } from '@material-ui/core';
//import { useDispatch, useSelector } from 'react-redux';
import { Header, Footer } from '../components';


function Profile() {


    return (
        <Grid>
            <Grid className='header'><Header /></Grid>

            <Grid className='content'>

                <Typography>profile page</Typography>
                    
 


            </Grid>


            <Grid className='footer'><Footer /></Grid>
        </Grid>
    )

}




export { Profile };