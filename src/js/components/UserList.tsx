import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { FunctionComponent } from "react"
import { User } from "../types/user";


export const UserList: FunctionComponent<{userList: User[] | null, onSelectUser: (user: User | null) => void}> = ({userList, onSelectUser}) => {
    const userElts = userList === null
        ? new Array(3).fill(null).map((_, i) =>
            <ListItem key={`skeleton_${i}`} divider button>
                <ListItemText primary={<Skeleton animation="wave"/>} secondary={<Skeleton width="60%" animation="wave"/>}/>
            </ListItem>)
        : userList.map((user) =>
        <ListItem key={user.username} divider button onClick={() => onSelectUser(user)}>
            <ListItemText primary={user.displayName} secondary={'@' + user.username}/>
        </ListItem>);
        
    return (
        <OverlayScrollbarsComponent>
            <List aria-label="list of conversations">
                {userElts}
            </List>
        </OverlayScrollbarsComponent>
    )
};