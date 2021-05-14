import {createMuiTheme} from "@material-ui/core";

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#8e24aa',
      light: '#c158dc',
      dark: '#5c007a',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
      contrastText: '#000000'
    }
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  }
})

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#8e24aa',
      light: '#c158dc',
      dark: '#5c007a',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
      contrastText: '#000000'
    }
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  }
})

export {lightTheme, darkTheme}
