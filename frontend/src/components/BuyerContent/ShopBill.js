import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { React, useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";

const useStyles = makeStyles((theme) => ({
  card: {
    // backgroundColor: "#ffffff",
    // position: "sticky",
    // marginTop: theme.spacing(10),
    // marginRight: theme.spacing(3)

    background: "white",
    // position: "-webkit-sticky",
    position: "sticky",
    top: theme.spacing(10),
    bottom: 20,
    paddingTop: "40px",
    paddingBottom: "40px",
    // zIndex: 5,
  },
}));

function ShopBill({data}) {
  const classes = useStyles();
  return (
    <>
      <Card elevation={2} className={classes.card}>
        <CardContent>
          <Typography>
              Order summary
          </Typography>
          
        </CardContent>
      </Card>
    </>
  );
}

export default ShopBill;
