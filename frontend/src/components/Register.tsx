import React, {useEffect, useState} from 'react'

import CardContent from '@material-ui/core/CardContent'
import api from 'api'
import useLocalForage from "../hooks/useLocalForage"
import {useSnackbar} from 'notistack'
import {MuiForm as Form} from '@rjsf/material-ui'
import {JSONSchema7} from "json-schema"
import Group from "types/Group"
import {LoginStore} from "store"
import LoadingScreen from "components/LoadingScreen";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const registerSchema = (groups: Group[]): JSONSchema7 => ({
    "title": "Register",
    "type": "object",
    "properties": {
        "username": {
            //"minLength": 3,
            "title": "Username",
            "type": "string"
        },
        "password": {
            //"minLength": 6,
            "title": "Password",
            "type": "string"
        },
        "password2": {
            "title": "Confirm password",
            "type": "string"
        },
        "first_name": {
            "title": "First name",
            "type": "string"
        },
        "last_name": {
            "title": "Last name",
            "type": "string"
        },
        "group": {
            "title": "Group",
            "type": "number",
            "anyOf": groups.map(g => ({
                "type": "number",
                "title": g.name,
                "enum": [
                    g.id
                ]
            }))
        }
    },
    "required": ["first_name", "last_name", "group", "username", "password", "password2"]
})

const uiSchema = {
    password: {
        "ui:widget": "password"
    },
    password2: {
        "ui:widget": "password"
    }
}

const validate = (formData: any, errors: any) => {
  if (formData.pass1 !== formData.pass2) {
    errors.pass2.addError("Passwords don't match")
  }
  return errors
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        registerContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }
    })
)

const Register = () => {
    const classes = useStyles()
    const [schema, setSchema] = useState<JSONSchema7>()
    const [, setToken] = useLocalForage("token")
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        (async () => {
            const groups = await api.getGroups()
            setSchema(registerSchema(groups))
        })()
    }, [])

    const handleRegister = async function ({username = "", password = "", group = 0, first_name = "", last_name = ""}) {
        try {
            const userFromServer = await api.register(username, password, {
                group,
                first_name,
                last_name
            })
            LoginStore.update(s => {
                s.user = userFromServer
            })
            const token = await api.getToken(username, password)
            setToken(token)
            api.setToken(token)
            enqueueSnackbar('Login success!', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar(`Register error: ${e}`, {variant: 'error'})
        }
    }

    return schema ? (
        <>
            <CardContent>
                <Form schema={schema}
                      uiSchema={uiSchema}
                      validate={validate}
                      onSubmit={(e) => handleRegister(e.formData)}>
                    <div className={classes.registerContainer}>
                      <Button variant="contained" color="primary" type="submit">Register</Button>
                    </div>
                </Form>
            </CardContent>
        </>
    ) : <LoadingScreen/>
}

export default Register
