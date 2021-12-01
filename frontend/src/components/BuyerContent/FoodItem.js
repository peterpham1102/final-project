import {
  CardMedia,
  Grid,
  List,
  ListItem,
  Typography,
  makeStyles,
  alpha,
} from "@material-ui/core";
import { React, useContext, useEffect, useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";
import { useCart } from "react-use-cart";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ffffff",
    justifyContent: 'space-between'
  },
  title: {
    margin: theme.spacing(2),
  },
  foodName: {
    margin: theme.spacing(3),
  },
  list: {},
  button: {},
  right: {
    display: "flex",
  },
  addButton: {
    "&:hover": {
      // backgroundColor: alpha(theme.palette.common.black, 0.25),
      backgroundColor: "#ffffff",
      cursor: "pointer"
    },
  }
}));

function FoodItem(props) {
  const classes = useStyles();
  const { addItem } = useCart();
  return (
    <>
      {/* <Grid container >
        <Grid item xs={2} sm={2}>
          <img
            height="100px"
            width="100px"
            src={props.image}
            alt="Food Image"
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography variant="h5">{props.name}</Typography>
          <Typography variant="h6">{props.description}</Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <div className={classes.right}>
            <Typography>{props.price}VND</Typography>
            {
              <AddCircleOutlineIcon
              className={classes.addButton}
              style={{ fill: "#3ef20c"  }}
              fontSize="large"
                onClick={props.onClick}
              />
            }
          </div>
        </Grid>
      </Grid> */}
      <div style={{display: 'flex', justifyContent:'space-between', padding: 20, margin: 5, backgroundColor: '#ebe9e6'}}>
        <div style={{display: 'flex'}}>
          <img
            height="100px"
            width="100px"
            src={props.image}
            alt="Food Image"
          />
          <div style={{marginLeft: 20}}>
            <Typography variant="h5">{props.name}</Typography>
            <Typography variant="h6">{props.description}</Typography>
          </div>
        </div>
        <div style={{display: 'flex'}}>
          <Typography style={{marginRight: 5}}>{props.price} $</Typography>
          <AddCircleOutlineIcon
            className={classes.addButton}
            style={{ fill: "#3ef20c" }}
            fontSize="large"
            onClick={props.onClick}
          />

        </div>
      </div>
    </>
  );
}

export default FoodItem;
