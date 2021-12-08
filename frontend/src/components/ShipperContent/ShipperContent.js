import { AccountBox, Insights, Store } from "@mui/icons-material";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Container, makeStyles } from "@material-ui/core";
import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { AuthContext } from "../../App";
import ReceiveOrder from "./ReceiveOrder";
import ShipperOrders from "./ShipperOrders";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(5),
      marginLeft: theme.spacing(1),
    },
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },

  container: {
    height: "100vh",
    color: "white",
    paddingTop: theme.spacing(12),
    backgroundColor: theme.palette.primary.main,
    position: "sticky", 
    top: 0,
    [theme.breakpoints.up("sm")]: {
      
      backgroundColor: "#039be5",
      color: "#555",
      border: "1px solid #ece7e7",
    },
  },
  item: {
    color: "#039be5",
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(3),
      cursor: "pointer",
    },
  },
  icon: {
    color: "#ffffff",
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      fontSize: "18px",
    },
  },
  text: {
    color: "#ffffff",
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

function ShipperContent() {


  const classes = useStyles();

  return (
    <div>
      <BrowserRouter basename="shipper">
        <Grid container>
          <Grid item sm={2} xs={2}>
            <Container className={classes.container}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <ReceiptLongIcon className={classes.icon} />
                  <Typography className={classes.text}>Incoming Order</Typography>
                </div>
              </Link>
              <Link to="/orders" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <ReceiptIcon className={classes.icon} />
                  <Typography className={classes.text}>
                    My Orders
                  </Typography>
                </div>
              </Link>
              
            </Container>
          </Grid>
          <Grid item sm={9} xs={7} className={classes.root}>
            
            <Switch>
              <Route exact path="/" exact component={ReceiveOrder}  />
              
              
              <Route exact path="/orders" component={ShipperOrders} />
              
              
            </Switch>
          </Grid>
          
        </Grid>
      </BrowserRouter>
    </div>
  );
}

export default ShipperContent
