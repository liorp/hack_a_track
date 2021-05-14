import React, {useEffect, useState} from 'react'
import {LoginStore} from 'store'
import api from 'api'
import StageInstance from 'types/StageInstance'
import Countdown from "components/Countdown"
import {MuiForm as Form} from "@rjsf/material-ui"
import LoadingScreen from "./LoadingScreen"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import {useSnackbar} from "notistack"
import Button from "@material-ui/core/Button"
import Group from "../types/Group"
import {JSONSchema7} from "json-schema"

const stageSchema: JSONSchema7 = {
    "title": "",
    "type": "object",
    "properties": {
        "password": {
            "title": "Password",
            "type": "string"
        }
    },
    "required": ["password"]
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(4),
            flexGrow: 1
        },
        stageDetailsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            minHeight: '50vh',
            justifyContent: 'space-between'
        },
        unlockContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        countdownContainer: {
            justifySelf: 'flex-end'
        }
    })
)


const StageView = () => {
    const classes = useStyles()
    const user = LoginStore.useState(s => s.user!)
    const [stage, setStage] = useState<StageInstance>(null!)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        (async () => {
            const stage = await api.getCurrentStageInstance(user.participant.id)
            await new Promise(r => setTimeout(r, 1000))
            setStage(stage)
        })()
    }, [user])

    const handleSubmit = async (formData: any) => {
        try {
            const stage = await api.submitPasswordForStage(formData.password)
            await new Promise(r => setTimeout(r, 1000))
            setStage(stage)
            enqueueSnackbar('Next stage unlocked!', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar(e.response.data.error, {variant: 'error'})
        }
    }

    return stage ? (
        <div className={classes.container}>
            <div className={classes.stageDetailsContainer}>
                <Typography variant="h1">
                    Welcome, {user.participant.first_name}.
                </Typography>
                <Typography variant="h4" style={{width: '70%'}}>
                    Stage: {stage.stage.name}
                </Typography>
                <Typography variant="h6" align="center">
                    {stage.stage.description}
                </Typography>
                <div style={{width: '50%', alignSelf: 'center'}}>
                    <Form schema={stageSchema}
                          onSubmit={(e) => handleSubmit(e.formData)}
                    >
                        <div className={classes.unlockContainer}>
                            <Button variant="contained" color="primary"
                                    type="submit">Unlock</Button>
                        </div>
                    </Form>
                </div>
            </div>
            <div className={classes.countdownContainer}>
                <Countdown to={(user.participant.group as Group).competition.end_time} />
            </div>
        </div>
    ) : (<LoadingScreen>
        Loading stage...
    </LoadingScreen>)
}

export default StageView
