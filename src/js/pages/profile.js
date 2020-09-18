import React, { useCallback, useContext } from 'react';
import { withRouter } from 'react-router';
import { Grid } from '@material-ui/core';
import { Header } from '../components';
import { AuthContext } from '../utils';
import AdminProfile from '../components/profileAdmin';
import TeacherProfile from '../components/profileTeacher';
import StudentProfile from '../components/profileStudent';


const Profile = function ({ history }) {

  const { currentUserRole } = useContext(AuthContext);
  const role = currentUserRole;
  console.log("role", role);
  //click back to home page
  const handleClick = useCallback(async event => {
    event.preventDefault();

    try {
      history.push('/home'); // switch /home to the constant
    } catch (error) {
      alert(error);
    }

  }, [history]);

  //fetch all the data from the database here and then pass it to the components as props.

  return (
    <Grid>
      <Grid className='header'>
        <Header />
      </Grid>

      <Grid container className='content' justify="center" alignItems="center">
        <Grid container item xs={12} sm={12} md={12} lg={12} justify={"space-around"} alignItems={"center"}>
          {{
            student: (
              <StudentProfile />
            ),
            admin: (
              <AdminProfile />
            ),
            teacher: (
              <TeacherProfile />
            ),
            default: (
              <>Error</>
            )
          }[role]}
        </Grid>
      </Grid>

    </Grid>
  )

}




export const ProfileWithRouter = withRouter(Profile);