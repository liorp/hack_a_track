import React from 'react'

import api from 'api'
import useLocalForage from "hooks/useLocalForage"
import {useSnackbar} from 'notistack'
import {LoginStore} from "store"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"


const Logout = () => {
    const [, , removeToken] = useLocalForage("token")
    const {enqueueSnackbar} = useSnackbar()

    const handleLogout = async function () {
        try {
            removeToken()
            api.removeToken()
            LoginStore.update(s => {
                s.user = null
            })
            enqueueSnackbar('Logout success!', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar(`Logout error: ${e}`, {variant: 'error'})
        }
    }

    return (
        <Tooltip title="Logout" aria-label="logout">
            <IconButton aria-label="open-user-settings" onClick={handleLogout}>
                <ExitToAppIcon />
            </IconButton>
        </Tooltip>
    )
}

export default Logout
