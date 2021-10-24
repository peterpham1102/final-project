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

function ShopBill() {
  const classes = useStyles();
  return (
    <div>
      
    </div>
  )
}

export default ShopBill
