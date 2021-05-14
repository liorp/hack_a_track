import React from 'react'

import CardContent from '@material-ui/core/CardContent'
import api from 'api'
import useLocalForage from "../hooks/useLocalForage"
import { useSnackbar } from 'notistack'
import {MuiForm as Form} from '@rjsf/material-ui'
import {LoginStore} from "store"
import Button from "@material-ui/core/Button"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import {JSONSchema7} from "json-schema"

const loginSchema: JSONSchema7 = {
    "title": "Login",
    "type": "object",
    "properties": {
        "username": {
            "title": "Username",
            "type": "string"
        },
        "password": {
            "title": "Password",
            "type": "string",
        },
    },
    "required": ["username", "password"]
}

const uiSchema = {
    password: {
        "ui:widget": "password"
    }
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        loginContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }
    })
)

const Login = () => {
    const classes = useStyles()
    const [, setToken] = useLocalForage("token")
    const { enqueueSnackbar } = useSnackbar()

    const handleLogin = async function ({username = "", password = ""}) {
        try {
            const token = await api.getToken(username, password)
            setToken(token)
            api.setToken(token)
            const user = await api.getUser()
            LoginStore.update(s => {
                s.user = user
            })
            enqueueSnackbar('Login success!', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar(`Login error: ${e}`, {variant: 'error'})
        }
    }

    return (
        <>
            <CardContent>
                <Form schema={loginSchema}
                      uiSchema={uiSchema}
                      onSubmit={(e) => handleLogin(e.formData)}>
                    <div className={classes.loginContainer}>
                      <Button variant="contained" color="primary" type="submit">Login</Button>
                    </div>
                </Form>
            </CardContent>
        </>
    )
}

export default Login
