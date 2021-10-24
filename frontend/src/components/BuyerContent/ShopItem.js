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

import {Link} from 'react-router-dom'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  card: {
      
    marginBottom: theme.spacing(2),
    
  },
  
}));
function ShopItem({data}) {
  const classes = useStyles();
  // const {key, image, name, description} = props
  return (
    <Link to={"/store/" + data.key} style={{ textDecoration: 'none' }} >
    <Card className={classes.card} key={data.key} sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia className={classes.media} 
        component="img"
        image={data.image}
        height="200"
        alt="Shop Image"
         />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.description}
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
    </Link>
    
  )
}

export default ShopItem
