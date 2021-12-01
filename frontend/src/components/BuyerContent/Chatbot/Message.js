
import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";

const useStyles =  makeStyles((theme) => ({
    messageRow: {
        display: "flex"
    },
    messageRowRight: {
        display: "flex",
        justifyContent: "flex-end"
    },
    messageBlue: {
        position: "relative",
        marginLeft: "20px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#A8DDFD",
        width: "60%",
        //height: "50px",
        textAlign: "left",
        font: "400 .9em 'Open Sans', sans-serif",
        border: "1px solid #97C6E3",
        borderRadius: "10px",
        "&:after": {
            content: "''",
            position: "absolute",
            width: "0",
            height: "0",
            borderTop: "15px solid #A8DDFD",
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            top: "0",
            left: "-15px"
        },
        "&:before": {
            content: "''",
            position: "absolute",
            width: "0",
            height: "0",
            borderTop: "17px solid #97C6E3",
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            top: "-1px",
            left: "-17px"
        }
    },
    messageOrange: {
        position: "relative",
        marginRight: "20px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#f8e896",
        width: "60%",
        //height: "50px",
        textAlign: "left",
        font: "400 .9em 'Open Sans', sans-serif",
        border: "1px solid #dfd087",
        borderRadius: "10px",
        "&:after": {
            content: "''",
            position: "absolute",
            width: "0",
            height: "0",
            borderTop: "15px solid #f8e896",
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            top: "0",
            right: "-15px"
        },
        "&:before": {
            content: "''",
            position: "absolute",
            width: "0",
            height: "0",
            borderTop: "17px solid #dfd087",
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            top: "-1px",
            right: "-17px"
        }
    },

    messageContent: {
        padding: 0,
        margin: 0
    },
    messageTimeStampRight: {
        position: "absolute",
        fontSize: ".85em",
        fontWeight: "300",
        marginTop: "10px",
        bottom: "-3px",
        right: "5px"
    },

    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        color: 'orange',
        backgroundColor: deepOrange[500],
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    avatarNothing: {
        color: "transparent",
        backgroundColor: "transparent",
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    displayName: {
        marginLeft: "20px"
    }
}))

const Message = (props) => {
    const classes = useStyles()
    return (

        // <div className="col s12 m8 offset-m2 l6 offset-l3">
        //     <div className="card-panel grey lighten-5 z-depth-1">
        //         <div className="row valign-wrapper">
        //             {props.speaks==='bot' &&
        //             <div className="col s2">
        //                 <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
        //             </div>
        //             }
        //             <div className="col s10">
        //               <span className="black-text">
        //                 {props.text}
        //               </span>
        //             </div>
        //             {props.speaks==='user' &&
        //             <div className="col s2">
        //                 <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
        //             </div>
        //             }
        //         </div>
        //     </div>
        // </div>
        <>
            {
                props.speaks === 'bot' &&
                <div className={classes.messageRow}>
                    <Avatar
                        alt="Xem nhe"
                        className={classes.orange}
                        src="https://www.wallpapertip.com/wmimgs/92-921303_data-src-w-full-c-3-1-539439.jpg"
                    ></Avatar>
                    <div>

                        <div className={classes.displayName}>{props.speaks}</div>
                        <div className={classes.messageBlue}>
                            <div>
                                <p className={classes.messageContent}>{props.text}</p>
                            </div>
                            <div className={classes.messageTimeStampRight}>timestamp</div>
                        </div>
                    </div>
                </div>
            }
            {
                props.speaks === 'user' &&
                <div className={classes.messageRowRight}>
                    <div className={classes.messageOrange}>
                        <p className={classes.messageContent}>{props.text}</p>
                        <div className={classes.messageTimeStampRight}>timestamp</div>
                    </div>
                </div>
            }

        </>

    );

};

export default Message;
