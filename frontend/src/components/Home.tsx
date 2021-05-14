import React from 'react'
import StageView from 'components/StageView'
import {makeStyles} from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1,
        marginTop: theme.spacing(2)
    },
    paper: {
        flexGrow: 0.7,
        display: 'flex',
        justifyContent: 'space-around'
    }
}))

const Home = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <StageView />
            </Paper>
        </div>
    )
}

export default Home
