import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Grid } from '@material-ui/core';
import { RouterHeader } from '../components';
import { AuthContext } from '../utils';
import AdminProfile from '../components/profileAdmin';
import TeacherProfile from '../components/profileTeacher';
import StudentProfile from '../components/profileStudent';


const Profile = function ({ history }) {

  const { currentUserRole } = useContext(AuthContext);
  const role = currentUserRole;
  console.log("role", role);

  const [state, setState] = useState({
    uiState: {
      mounted: false,
      action: null,
    },
    data: null
  })

  //click back to home page
  function handleClick() {
    try {
      history.push('/home'); // switch /home to the constant
    } catch (error) {
      alert(error);
    }
  };

  //fetch all the data from the database here and then pass it to the components as props.

  useEffect(() => {

    if (!state.uiState.mounted) {
      setState({
        ...state,
        uiState: {
          mounted: true,
        }
      })
    }
  }, [state])


  return (
    <Grid>
      <Grid className='RouterHeader'>
        <RouterHeader onClick={handleClick} link={'Home'} />
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
              <TeacherProfile props={state.data} />
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