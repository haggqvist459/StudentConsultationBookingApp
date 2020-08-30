import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import '../../sass/index.scss';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#101820",
        },
        secondary: {
            main: "#D4CE71"
        }
    },    
    typography: {
       
    }
});
 

const responsiveTheme = responsiveFontSizes(theme);

export { responsiveTheme };