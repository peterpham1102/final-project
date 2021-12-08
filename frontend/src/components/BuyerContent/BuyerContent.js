import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Grid, makeStyles, Typography, InputBase, alpha, } from "@material-ui/core";

import DetailShop from "./DetailShop";


import ShopBill from "./ShopBill";
import ShopList from "./ShopList";
import { React, useContext, useEffect, useState } from "react";
import Chatbot from "./Chatbot/Chatbot";

import Controls from "../../shared/components/UIElements/Controls";
import { AuthContext } from "../../App";
import BuyerOrders from "./BuyOrders";

const useStyles = makeStyles((theme) => ({
  shopList: {
    marginTop: theme.spacing(12),
    left: theme.spacing(5),
    alignContent: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(1),
    },
    right: {
      marginTop: theme.spacing(10)
    },
    //   marginLeft: theme.spacing(3),
    //   marginRight: theme.spacing(3),
    //   // backgroundColor: "red"
    // },
    root: {
      marginTop: theme.spacing(12),
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(8),
        marginLeft: theme.spacing(1),
      },
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      // backgroundColor: "green"
    },
    search: {

      display: "flex",
      alignItems: "center",
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      borderRadius: theme.shape.borderRadius,
      width: "25%",
      [theme.breakpoints.down("sm")]: {
        display: (props) => (props.open ? "flex" : "none"),
        width: "50%",
      },
    },
    searchButton: {
      backgroundColor: "#00a7fa",
      color: "#FFFFFF",

    }
  },
}));

function BuyerContent() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const authValue = useContext(AuthContext);
  const { user } = authValue;

  

  return (
    <div>
      <BrowserRouter basename="buyer">



        <div style={{ marginTop: 80, right: 50, position: "absolute" }}>
          {/* <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant="contained"
          >
            My Order
          </Button> */}
          <Link to={`/orders/user/${user.userId}`} style={{ textDecoration: 'none' }}>
            <Controls.Button >
              My Order
            </Controls.Button>
          </Link>

        </div>
        <Grid container className={classes.root}>
          <Switch>
            <Route path="/store/:id" component={DetailShop} />
          </Switch>
          <Grid item sm={2} xs={2} className={classes.left}>

          </Grid>

          <Grid item sm={8} xs={8} className={classes.shopList}>
            
            <Switch>
              <Route exact path="/" exact component={ShopList} />
              {/* <Route exact path="/" exact component={ShopList} /> */}
              <Route exact path="/orders/user/:id" exact component={BuyerOrders} />
            </Switch>
          </Grid>

          <Grid item sm={2} xs={2} className={classes.right}>
            {/* <ShopBill /> */}
            {/* <Chatbot /> */}

          </Grid>
        </Grid>
        
      </BrowserRouter>
    </div>
  );
}

export default BuyerContent;
