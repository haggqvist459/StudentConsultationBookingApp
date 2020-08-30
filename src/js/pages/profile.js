import React from 'react'
import { Grid, Typography } from '@material-ui/core';
//import { useDispatch, useSelector } from 'react-redux';
import { Header, Footer } from '../components';


const Profile = function ({ history }) {


    //click back to home page
    const handleClick = useCallback(async event => {
        event.preventDefault();
    
        try {
          history.push('/home'); // switch /home to the constant
        } catch (error) {
          alert(error);
        }
    
      }, [history]);

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




export const ProfileWithRouter = withRouter(Profile);