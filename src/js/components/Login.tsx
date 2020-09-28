import React, { FunctionComponent, useState } from "react";
import { Box, Button, Collapse, Fade, FilledInput, FormControl, Grow, IconButton, InputAdornment, InputLabel, LinearProgress, Snackbar, TextField, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from '@material-ui/lab';
import { AuthenticatedUser, LocalAuth } from "../types/user";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { authHeader, hashString, jsonHeader } from "../util";

const useStyles = makeStyles(theme => ({
    spaced: {
        "& > :not(.MuiCollapse-container)": {
            margin: theme.spacing(1)
        },
        "& > .MuiCollapse-container .MuiCollapse-wrapperInner > *": {
            margin: theme.spacing(1),
            width: `calc(100% - ${theme.spacing(1) * 2}px)`
        }
    },
    absoluteCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0
    }
}));

export const Login: FunctionComponent<{loginAsCallback: (user: AuthenticatedUser) => void}> = ({loginAsCallback}) => {
    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");

    const validateUsername = (username: string) => username.match(/^[a-z_][a-z0-9_]{3,}$/) != null;
    const validateDisplayName = (displayName: string) => displayName.match(/^\S(.*\S)?$/) != null;
    const validatePassword = (password: string) => password.length > 7;

    const [registering, setRegistering] = useState(false);

    const [loading, setLoading] = useState(false);
    const loadingPromise = async (val: boolean) => {
        setLoading(val);
    }

    async function login() {
        const hash = await hashString(password);
        const response = await fetch("/api/me", { headers: authHeader({username, authKind: 'local', hash}) });
        if (response.ok) {
            return loginAsCallback(await response.json());
        }
        showError("Incorrect username or password");
    }

    async function register() {
        if (!validateUsername(username)) {
            if (username.match(/[A-Z]/))
                return showError("Your username must be lowercase");
            if (username.match(/[^a-z0-9_]/))
                return showError("Your username can only include lowercase letters, numbers, and underscores");
            if (username.match(/^[^a-z_]/))
                return showError("Your username must start with a letter or underscore");
            if (username.length < 4)
                return showError("Your username must be at least four characters long");
            return showError("An error has occurred. Please try a different username.");
        }
        if (!validateDisplayName(displayName)) {
            if (displayName.length === 0)
                return showError("You cannot have an empty display name");
            return showError("Your display name cannot start or end with whitespace");
        }
        if (!validatePassword(password)) {
            return showError("Your password must be at least 8 characters long");
        }

        const response = await fetch("/api/register", {
            method: "POST",
            headers: jsonHeader,
            body: JSON.stringify({
                username,
                displayName,
                authKind: "local",
                hash: await hashString(password)
            } as LocalAuth)
        });
        if (response.ok) {
            loginAsCallback(await response.json());
        }
        else {
            const msg = await response.text();
            if (msg === "User already exists") {
                return showError("A user with that username already exists. Choose another username");
            }
            showError(msg);
        }
    }

    const [errorOpen, setErrorOpen] = useState(false);
    const closeError = () => setErrorOpen(false);
    const [errorMessage, setErrorMessage] = useState("");
    function showError(msg: string) {
        setErrorMessage(msg);
        setErrorOpen(true);
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box className={classes.absoluteCenter}>
            <form onSubmit={e => e.preventDefault()} noValidate>
                <Box display="flex" flexDirection="column" textAlign="center" className={classes.spaced}>
                    <Collapse in={registering}>
                        <Grow in={registering}>
                            <TextField
                                label="Display Name"
                                variant="filled"
                                required={true}
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                error={registering && !validateDisplayName(displayName)}/>
                        </Grow>
                    </Collapse>
                    
                    <TextField
                        label="Username"
                        variant="filled"
                        required={registering}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        error={registering && !validateUsername(username)}/>

                    <FormControl variant="filled" required={registering} error={registering && !validatePassword(password)}>
                        <InputLabel htmlFor="login-password">Password</InputLabel>
                        <FilledInput
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Toggle Password Visibility">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }/>
                    </FormControl>
                    <Button variant="text" onClick={() => setRegistering(!registering)}>{registering ? "Already registered?" : "Not registered?"}</Button>
                    <Button variant="contained"
                            color="primary"
                            type="submit"
                        onClick={() => loadingPromise(true).then(registering ? register : login).then(() => loadingPromise(false))}>
                        {registering ? "Register" : "Login"}
                    </Button>
                </Box>
                <Fade in={loading}><LinearProgress/></Fade>
            </form>
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={errorOpen} autoHideDuration={6000} onClose={closeError}>
                <Alert onClose={closeError} severity="error" variant="filled">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};