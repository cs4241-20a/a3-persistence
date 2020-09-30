import { Box, Grow, IconButton, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Brightness4, Brightness7, ExitToApp } from "@material-ui/icons";
import React, { FunctionComponent } from "react";
import { User } from "../types/user";

const useStyles = makeStyles(theme => ({
    buttonIcon: {
        fontSize: 36
    },
    controlsContainer: {
        position: "fixed",
        display: "flex",
        flexDirection: "row-reverse",
        top: theme.spacing(1),
        right: theme.spacing(1),
    }
}));

export const PersistentControls: FunctionComponent<{
    darkTheme: boolean;
    setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>
    user: User | null;
    logout: () => void;
}> = ({darkTheme, setDarkTheme, user, logout}) => {
    const classes = useStyles();
    return (
        <Box className={classes.controlsContainer}>
            <Tooltip title="Toggle Dark Theme">
                <IconButton onClick={() => setDarkTheme(!darkTheme)} aria-label="toggle dark theme" component="span">
                    {darkTheme ? <Brightness7 className={classes.buttonIcon}/> : <Brightness4 className={classes.buttonIcon}/>}
                </IconButton>
            </Tooltip>
            <Grow in={user != null}>
                <Tooltip title="Logout">
                    <IconButton onClick={logout} aria-label="log out" component="span">
                        <ExitToApp className={classes.buttonIcon}/>
                    </IconButton>
                </Tooltip>
            </Grow>
        </Box>
    );
};