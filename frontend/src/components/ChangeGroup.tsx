import React, {useEffect, useState} from 'react'

import {LoginStore} from 'store'
import api from 'api'
import Group from "../types/Group"
import {JSONSchema7} from "json-schema"
import {useSnackbar} from "notistack"
import {MuiForm as Form} from "@rjsf/material-ui"
import LoadingScreen from "./LoadingScreen"
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const changeGroupSchema = (groups: Group[], currentGroup: Group): JSONSchema7 => ({
    "title": "Change Group",
    "type": "object",
    "properties": {
        "group": {
            "title": "Group",
            "type": "number",
            "anyOf": groups.map(g => ({
                "type": "number",
                "title": g.name,
                "enum": [
                    g.id
                ]
            })),
            "default": currentGroup.id
        }
    },
    "required": ["group"]
})


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formContainer: {
            height: '25vh',
            width: '20vw',
            padding: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        changeGroupContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }
    })
)

const ChangeGroup = () => {
    const [schema, setSchema] = useState<JSONSchema7>()
    const {enqueueSnackbar} = useSnackbar()
    const user = LoginStore.useState(s => s.user)!
    const classes = useStyles()

    useEffect(() => {
        (async () => {
            const groups = await api.getGroups()
            await new Promise(r => setTimeout(r, 1000))
            setSchema(changeGroupSchema(groups, user.participant.group as Group))
        })()
    }, [user.participant.group])

    const handleChangeGroup = async function (formData: any) {
        try {
            const userFromServer = await api.changeGroup(user.participant.id, formData.group)
            LoginStore.update(s => {
                s.user = userFromServer
            })
            enqueueSnackbar('Change group success!', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar(`Change group error: ${e}`, {variant: 'error'})
        }
    }

    return schema ? (
        <div className={classes.formContainer}>
            <Form schema={schema} onSubmit={(e) => handleChangeGroup(e.formData)}>
                <div className={classes.changeGroupContainer}>
                    <Button variant="contained" color="primary" type="submit">Change Group</Button>
                </div>
            </Form>
        </div>
    ) : (<div className={classes.formContainer}>
        <LoadingScreen>
            Loading groups...
        </LoadingScreen>
    </div>)
}

export default ChangeGroup
