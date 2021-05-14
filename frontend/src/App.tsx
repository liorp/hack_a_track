import React, {useEffect, useState} from 'react'
import 'App.css'
import Routing from 'components/Routing'
import {makeStyles, ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from "@material-ui/core/CssBaseline"
import useLocalForage from "hooks/useLocalForage"
import api from "api"
import {LoginStore} from "store"
import LoadingScreen from "components/LoadingScreen"
import {SnackbarProvider} from 'notistack'
import CustomAppBar from "components/CustomAppBar"
import useDarkMode from "hooks/useDarkTheme"
import {darkTheme, lightTheme} from "./theme";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    }
});

function App(): JSX.Element {
    const [loading, setLoading] = useState(true)
    const [token, , removeToken] = useLocalForage("token", "")
    const classes = useStyles()

    useEffect(() => {
        (async () => {
            if (token !== "") {
                setLoading(true)
                try {
                    api.setToken(token)
                    const user = await api.getUser()
                    LoginStore.update(s => {
                        s.user = user
                    })
                } catch (e) {
                    removeToken()
                    api.removeToken()
                } finally {
                    setLoading(false)
                }
            }
        })()
    }, [token])

    const [themeMode, toggleTheme] = useDarkMode()
    const theme = themeMode === 'light' ? lightTheme : darkTheme

    return (
        <ThemeProvider theme={theme}>
            <div>
                <CssBaseline />
                <SnackbarProvider maxSnack={3}>
                    <div className={classes.root}>
                        <CustomAppBar theme={themeMode} toggleDarkMode={toggleTheme} />
                        {loading
                            ? (
                                <LoadingScreen>
                                    Loading app..
                                </LoadingScreen>
                            )
                            : (
                                <Routing />
                            )}
                    </div>
                </SnackbarProvider>
            </div>
        </ThemeProvider>
    )
}

export default App
