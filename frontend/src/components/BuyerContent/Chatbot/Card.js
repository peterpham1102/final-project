import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    makeStyles,
} from "@material-ui/core";

import { Link } from 'react-router-dom'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    card: {

        marginBottom: theme.spacing(0.5),
        
    },

}));

const CardChatbot = (props) => {
    const classes = useStyles();
    return (
        // <div  style={{ height: 270, paddingRight:30, float: 'left'}}>
        //     <div className="card">
        //         <div className="card-image" style={{ width: 240}}>
        //             <img alt={props.payload.fields.header.stringValue} src={props.payload.fields.image.stringValue} />
        //             <span className="card-title">{props.payload.fields.header.stringValue}</span>
        //         </div>
        //         <div className="card-content">
        //             {props.payload.fields.description.stringValue}
        //             <p> <a href="/">{props.payload.fields.price.stringValue}</a></p>
        //         </div>
        //         <div className="card-action">
        //             <a target="_blank" rel="noopener noreferrer" href={props.payload.fields.link.stringValue}>GET NOW</a>
        //         </div>
        //     </div>
        // </div>

        <Card className={classes.card} key={props.key}>
            <CardActionArea>
                <CardMedia className={classes.media}
                    component="img"
                    // image={props.image}
                    image={props.payload.fields.image.stringValue}
                    height="150"
                    alt="Shop Image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {/* {props.name} */}
                        {props.payload.fields.header.stringValue}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {/* {props.description} */}
                        {props.payload.fields.description.stringValue}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
        </Card>
    );
};

export default CardChatbot;