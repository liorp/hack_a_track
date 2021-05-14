import React, {useState} from 'react'
import Register from 'components/Register'
import Login from 'components/Login'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import {LoginStore} from '../store'
import {Redirect} from 'react-router-dom'
import Card from "@material-ui/core/Card"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        registerOrLogin: {
            padding: theme.spacing(2),
            boxShadow: 'none'
        },
        header: {
            textAlign: 'center',
            color: '#fff'
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2),
            maxWidth: '20%'
        }
    })
)

function Landing() {
    const classes = useStyles()
    const [state, setState] = useState('login')
    const user = LoginStore.useState(s => s.user)

    if (user != null) {
        return (<Redirect to='/' />)
    }

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <ButtonGroup className={classes.registerOrLogin} variant='contained' color='primary' aria-label='register or login'>
                    <Button onClick={() => setState('register')} >Register</Button>
                    <Button onClick={() => setState('login')}>Login</Button>
                </ButtonGroup>
                {state === 'login' && <Login />}
                {state === 'register' && <Register />}
            </Card>
        </div>
    )
}

export default Landing
