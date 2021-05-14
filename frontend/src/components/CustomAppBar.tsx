import React from 'react'
import {LoginStore} from 'store'
import {makeStyles} from "@material-ui/core/styles"
import {UserSettings} from "components/UserSettings"
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Logout from "components/Logout"
import DarkModeToggle from "react-dark-mode-toggle"

const useStyles = makeStyles({
    toolbar: {
        justifyContent: 'flex-end'
    }
});

interface CustomAppBarProps {
    theme: 'dark' | 'light'
    toggleDarkMode: (isChecked: boolean) => void
}

const CustomAppBar = ({theme, toggleDarkMode}: CustomAppBarProps) => {
    const classes = useStyles()
    const user = LoginStore.useState(s => s.user)!

    return (
        <>
            <AppBar position="sticky">
                <Toolbar className={classes.toolbar}>
                    { user && (<>
                        <Logout />
                        <UserSettings />
                    </>) }
                    <DarkModeToggle
                      onChange={toggleDarkMode}
                      checked={theme !== 'light'}
                      size={75}
                    />
                </Toolbar>
            </AppBar>
        </>
    )
}

export default CustomAppBar
