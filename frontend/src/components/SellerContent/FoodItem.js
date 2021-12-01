import {
  CardMedia,
  Grid,
  List,
  ListItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { React, useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
  return (
    <>
      
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
