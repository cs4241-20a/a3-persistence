import { Box, Paper, PaperProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";

const useStyles = makeStyles(theme => ({
    reactivePaper: {
        width: "100%",
        height: "100%"
    },
    contentPadding: {
        padding: theme.spacing(2)
    }
}));

interface ReactivePaperProps {
    PaperProps: PaperProps;
    padContent: boolean;
}

export const ReactivePaper: React.ForwardRefExoticComponent<React.PropsWithChildren<React.RefAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>> & Partial<ReactivePaperProps>> = React.forwardRef((props, ref) => {
    const classes = useStyles();

    const [isHovering, setIsHovering] = useState(false);
    
    function setHoveringTrue() { setIsHovering(true); }
    function setHoveringFalse() { setIsHovering(false); }
    
    const {PaperProps: {className: paperClassName, ...paperProps} = {className: ""}, padContent, ...mainProps} = props;

    return (
        <div ref={ref} {...mainProps}>
            <Paper {...paperProps} className={`${classes.reactivePaper} ${padContent ? classes.contentPadding : ''} ${paperClassName}`} elevation={isHovering ? 5 : 2} onMouseEnter={setHoveringTrue} onMouseLeave={setHoveringFalse}>
                {props.children}
            </Paper>
        </div>
    );
});