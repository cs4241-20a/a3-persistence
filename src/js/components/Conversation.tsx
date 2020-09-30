import { CircularProgress, IconButton, InputAdornment, List, ListItem, ListItemText, ListProps, Snackbar, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack, Send } from "@material-ui/icons";
import { Alert, Skeleton } from "@material-ui/lab";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import { Message } from "../types/message";
import { AuthenticatedUser, User } from "../types/user";
import { authHeader, jsonHeader } from "../util";

const useStyles = makeStyles(theme => ({
    messageList: {
        display: "flex",
        flexDirection: "column"
    },
    myMessage: {
        alignSelf: "flex-end",
        textAlign: "right"
    },
    myMsgSkeleton: {
        direction: "rtl"
    },
    theirMessage: {
        alignSelf: "flex-start",
        textAlign: "left"
    },
    message: {
        width: "max(45%, min(100%, 400px))",
        "& p": {
            wordBreak: "break-word"
        }
    },
    messageName: {
        color: theme.palette.text.hint
    },
    backBtn: {
        position: "absolute",
        top: theme.spacing(1),
        left: theme.spacing(1)
    }
}));

const MessageComponent: FunctionComponent<{authorDisplayName?: string, message?: Message | null, isMyMessage: boolean}> = ({authorDisplayName, message, isMyMessage}) => {
    const classes = useStyles();

    let primaryElt: JSX.Element;
    let secondaryElt: JSX.Element;

    if (message == null) {
        primaryElt = <Skeleton width="20%" height={30} animation="wave"/>;
        secondaryElt = <>
            <Skeleton animation="wave"/>
            <Skeleton width="60%" animation="wave"/>
        </>;
    }
    else {
        primaryElt = <Typography className={classes.messageName} variant="button" component="p">{authorDisplayName}</Typography>;
        secondaryElt = <Typography variant="body1">{message.contents}</Typography>;
    }

    const listItemClassList = [
        classes.message,
        isMyMessage ? classes.myMessage : classes.theirMessage,
        isMyMessage && message == null ? classes.myMsgSkeleton : ''
    ];

    return (
        <ListItem key={message?.id} className={listItemClassList.join(' ')}>
            <ListItemText primary={primaryElt} secondary={secondaryElt}/>
        </ListItem>
    );
};

interface ConversationProps {
    userList: User[] | null;
    connectedUser: AuthenticatedUser | null;
    otherUser: User | null;
    isThinScreen: boolean;
    onClose: () => void;
}

export const Conversation: FunctionComponent<ListProps & ConversationProps> = (
    {userList, connectedUser, otherUser, isThinScreen, onClose, className, ...listProps}
) => {
    const classes = useStyles();
    
    const [messages, _setMessages] = useState<Message[] | null>(null);

    const setMessages = (newMsgs: Message[] | null) => {
        const replacingSkeletons = messages === null;
        _setMessages(newMsgs);
        if (replacingSkeletons) {
            scrollToBottom();
        }
    };

    const checkForMessages = async () => {
        if (connectedUser != null) {
            const request = await fetch(`/api/conversation/${otherUser?.username}`, {headers: authHeader(connectedUser)});
            if (request.ok) {
                setMessages(await request.json());
            }
        }
    };

    useEffect(() => {
        setMessages(null);
        checkForMessages();
        const intervalId = setInterval(checkForMessages, 5000);
        return () => clearInterval(intervalId);
    }, [otherUser]);

    const [messageInput, setMessageInput] = useState("");
    const [messageBoxDisabled, setMessageBoxDisabled] = useState(false);
    const sendMessage = async () => {
        if (!messageBoxDisabled && connectedUser != null && messageInput !== "") {
            setMessageBoxDisabled(true);
            const response = await fetch('/api/message', {
                method: "POST",
                headers: {...authHeader(connectedUser), ...jsonHeader},
                body: JSON.stringify({
                    contents: messageInput,
                    to: otherUser?.username
                })
            });
            if (response.ok) {
                setMessageInput("");
                setMessages([...messages!, ...await response.json()])
            }
            else {
                showError("Message failed to send");
            }
            setMessageBoxDisabled(false);
        }
    };

    const conversationScrollbarRef = useRef<OverlayScrollbarsComponent>(null!);
    const scrollToBottom = () => {
        if (pinnedToBottom && conversationScrollbarRef) {
            const instance = conversationScrollbarRef.current!.osInstance()!;
            const target = conversationScrollbarRef.current!.osTarget()!;
            setTimeout(() => instance.scroll([0, instance.scroll().max.y]), 0);
        }
    }
    useEffect(scrollToBottom, [otherUser, messages]);

    const [pinnedToBottom, setPinnedToBottom] = useState(true);

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('observed')) {
            scrollToBottom();
        }
        else {
            setTimeout(() => {
                const scrollInfo = conversationScrollbarRef.current!.osInstance()!.scroll();
                setPinnedToBottom(scrollInfo.max.y - scrollInfo.position.y < 2);
            }, 0);
        }
    }

    const [errorOpen, setErrorOpen] = useState(false);
    const closeError = () => setErrorOpen(false);
    const [errorMessage, setErrorMessage] = useState("");
    function showError(msg: string) {
        setErrorMessage(msg);
        setErrorOpen(true);
    }

    const messageElts = messages
        ? messages.map(msg =>
            <MessageComponent
                authorDisplayName={userList?.find(x => x.username === msg.author)?.displayName}
                message={msg}
                isMyMessage={msg.author === connectedUser?.username} />)
        : new Array(3).fill(null).map((_, i) => <>
                <MessageComponent key={`left_${i}`} isMyMessage={false} />
                <MessageComponent key={`right_${i}`} isMyMessage={true} />
            </>);

    return <>
        <OverlayScrollbarsComponent ref={conversationScrollbarRef} onScroll={onScroll}>
            <List {...listProps} className={`${className} ${classes.messageList}`}>
                {messageElts}
            </List>
        </OverlayScrollbarsComponent>
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <TextField
                disabled={messageBoxDisabled}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                variant="outlined"
                fullWidth={true}
                InputProps={{endAdornment:
                    <InputAdornment position="end">
                        {messageBoxDisabled ? <CircularProgress/> : <IconButton aria-label="send message" type="submit"><Send/></IconButton>}
                    </InputAdornment>
                }}/>
        </form>
        {isThinScreen ? <IconButton className={classes.backBtn} onClick={onClose}><ArrowBack/></IconButton> : undefined}
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={errorOpen} autoHideDuration={6000} onClose={closeError}>
            <Alert onClose={closeError} severity="error" variant="filled">
                {errorMessage}
            </Alert>
        </Snackbar>
    </>;
};