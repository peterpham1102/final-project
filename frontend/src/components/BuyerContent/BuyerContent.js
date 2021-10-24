import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Grid, makeStyles } from '@material-ui/core'

import DetailShop from './DetailShop';
import React from 'react'
import ShopList from "./ShopList";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(1),
    },
  //   marginLeft: theme.spacing(3),
  //   marginRight: theme.spacing(3),
  //   // backgroundColor: "red"
  // },
  // root1: {
  //   marginTop: theme.spacing(10),
  //   [theme.breakpoints.down("sm")]: {
  //     marginTop: theme.spacing(8),
  //     marginLeft: theme.spacing(1),
  //   },
  //   marginLeft: theme.spacing(3),
  //   marginRight: theme.spacing(3),
  //   // backgroundColor: "green"
  // },
  // card: {
  //   marginBottom: theme.spacing(5),
  // },
  // media: {
  //   height: 250,
  //   [theme.breakpoints.down("sm")]: {
  //     height: 150,
  //   },
  },
}));


function BuyerContent() {
  const classes = useStyles();
  return (
    <div>
      <BrowserRouter basename="buyer">
      <Grid container className={classes.root}>
        <Grid item sm={2} xs={2} className={classes.left}>
          
        </Grid>
        <Grid item sm={8} xs={8} className={classes.shopList}>
          
        <Switch>
              <Route exact path="/" exact component={ShopList} />
              <Route exact path="/store/:id" component={DetailShop} />
              
            </Switch>
          </Grid>

      </Grid>
      <Grid item sm={2} xs={2} className={classes.right}>

      </Grid>
      </BrowserRouter>
    </div>
  )
}

export default BuyerContent
