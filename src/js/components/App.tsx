import React, { createRef, FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, CssBaseline, Grow, Slide, TextField, useMediaQuery } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { AuthenticatedUser, User } from '../types/user';
import { Login } from './Login';
import { blue, pink } from '@material-ui/core/colors';
import { PersistentControls } from './PersistentControls';
import { ReactivePaper } from './ReactivePaper';
import { UserList } from './UserList';
import { authHeader } from '../util';
import { Conversation } from './Conversation';
import 'overlayscrollbars/css/OverlayScrollbars.css';

const spacingAmount = 4;

const useStyles = makeStyles(theme => ({
    content: {
        "& > *": {
            margin: theme.spacing(spacingAmount),
            height: `calc(100vh - ${theme.spacing(spacingAmount) * 2}px)`
        },
        "& > :not(:last-child)": {
            marginRight: 0
        }
    },
    conservationContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        "& > :first-child": {
            flexGrow: 1,
            marginBottom: theme.spacing(2)
        }
    }
}));

const App: FunctionComponent = props => {
    const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)', {noSsr: true});
    const [useDarkTheme, setUseDarkTheme] = useState(prefersDarkTheme);
    const classes = useStyles();

    const theme = React.useMemo(() =>
        createMuiTheme({
            palette: useDarkTheme ? {
                type: 'dark',
                primary: { main: blue[400] },
                secondary: {main: pink[400] }
            } : 
            {
                type: 'light',
                primary: { main: blue[500] },
                secondary: {main: pink[500] }
            },
            overrides: {
                MuiCssBaseline: {
                    "@global": {
                        "#root": {
                            overflow: "hidden"
                        }
                    }
                }
            }
        }),
        [useDarkTheme],
    );


    const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

    const isThinScreen = !useMediaQuery(theme.breakpoints.up('sm'));

    const [userList, setUserList] = useState<User[] | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<User | null>(null);

    const loginAs = (user: AuthenticatedUser) => {
        setCurrentUser(user);
        localStorage.setItem("authenticatedUser", JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("authenticatedUser");
    };

    // Loading user list when logged in user changes
    useEffect(() => {
        if (currentUser === null) return setUserList(null);
        fetch('/api/users', {headers: authHeader(currentUser)})
        .then<User[]>(x => x.json())
        .then(setUserList);
    }, [currentUser]);
    
    // Not clear if this should actually be useMemo or useEffect... probably the latter? Whatever.
    useMemo(async () => {
        const authedUser = localStorage.getItem("authenticatedUser");
        if (authedUser != null) {
            const userObj = JSON.parse(authedUser);
            const authVerify = await fetch('/api/me', {headers: authHeader(userObj)});
            if (authVerify.ok) {
                loginAs(await authVerify.json());
            }
        }
        return null;
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Slide direction="up" in={currentUser != null} mountOnEnter unmountOnExit>
                <Box display="flex" className={classes.content}>
                    <Slide direction="right" in={selectedConversation == null || !isThinScreen} mountOnEnter unmountOnExit>
                        <ReactivePaper style={{flexBasis: `min(240px, calc(100vw - ${theme.spacing(spacingAmount) * 2}px))`, flexGrow: isThinScreen ? 1 : undefined}}>
                            <UserList userList={userList} onSelectUser={setSelectedConversation}/>
                        </ReactivePaper>
                    </Slide>
                    <Slide direction="left" in={selectedConversation != null} mountOnEnter unmountOnExit>
                        <ReactivePaper PaperProps={{className: classes.conservationContainer}} padContent style={{flexGrow: 1}}>
                            <Conversation userList={userList} connectedUser={currentUser} otherUser={selectedConversation} isThinScreen={isThinScreen} onClose={() => setSelectedConversation(null)}/>
                        </ReactivePaper>
                    </Slide>
                </Box>
            </Slide>
            <Grow in={currentUser == null} mountOnEnter unmountOnExit timeout={200}>
                <Login loginAsCallback={loginAs}/>
            </Grow>
            <PersistentControls darkTheme={useDarkTheme} setDarkTheme={setUseDarkTheme} user={currentUser} logout={logout}/>
        </ThemeProvider>
    );
}

if (typeof window !== 'undefined') {
    ReactDOM.render(<App />, document.getElementById('root'));
}