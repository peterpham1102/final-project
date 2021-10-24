import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItemText,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { React, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../App";
import { Rating } from "@mui/material";
import api from "../../shared/util/api";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ffffff"
  },
  card: {
  },
  list: {},
}));

function ShopInfo({data}) {
  const classes = useStyles()
  return (
    <>
    <Grid container className={classes.root}>
        <Grid item xs={5}>
          <Card className={classes.card}>
            <CardMedia
              component="img"
              height="300px"
              width="300px"
              image={data.image}
              alt="green iguana"
            />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <List className={classes.list}>
            <ListItemText primary={data.name} />
            <ListItemText primary={data.location} />
            <ListItemText primary={data.description} />
            <ListItemText primary={data.voucher} />
            
            <Rating name="read-only" defaultValue={data.rating} readOnly />
            {/* <ListItemText primary={shopData.rating} /> */}
          </List>
        </Grid>
      </Grid>
    </>
  )
}

export default ShopInfo
