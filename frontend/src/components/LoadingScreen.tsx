import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Player} from '@lottiefiles/react-lottie-player';

const useStyles = makeStyles({
    root: {
        height: '50%',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
})

interface IProps {
    children?: string | JSX.Element;
}

const LoadingScreen = ({children}: IProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Player
                autoplay
                loop
                src="https://assets3.lottiefiles.com/packages/lf20_sgnacf85.json"
            />
            {children}
        </div>
    );
};

export default LoadingScreen;
