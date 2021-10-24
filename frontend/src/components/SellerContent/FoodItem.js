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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ffffff",
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
}));

function FoodItem(props) {
  const classes = useStyles();
  return (
    <>
      
      <Grid container>
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
            {<Controls.Button
              text="+"
              variant="outlined"
              // startIcon={<AddIcon />}
              className={classes.button}
              onClick={props.onClick}
            />}
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default FoodItem;
