import { AccountBox, Insights, Store } from "@mui/icons-material";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Container, makeStyles } from "@material-ui/core";
import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AuthContext } from "../../App";
import CreateFood from "./CreateFood";
import EditFood from "./EditFood";
import EditStore from "./EditStore";
import ManageFood from "./ManageFood";
import ManageOrder from "./ManageOrder";
import ManageStore from "./ManageStore";
import Statistics from "./Statistics";
import { Receipt } from "@material-ui/icons";

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

function SellerContent() {


  const classes = useStyles();

  return (
    <div>
      <BrowserRouter basename="seller">
        <Grid container>
          <Grid item sm={2} xs={2}>
            <Container className={classes.container}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                <Store className={classes.icon} />
                 
                  <Typography className={classes.text}>My Store</Typography>
                </div>
              </Link>
              <Link to="/orders" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                <Receipt className={classes.icon} />
                  <Typography className={classes.text}>
                    Manage Orders
                  </Typography>
                </div>
              </Link>
              <Link to="/foods" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <FoodBankIcon className={classes.icon} />
                  <Typography className={classes.text}>Manage Foods</Typography>
                </div>
              </Link>
              <Link to="/statistics" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <Insights  className={classes.icon} />
                  <Typography className={classes.text}>Statistics</Typography>
                </div>
              </Link>
            </Container>
          </Grid>
          <Grid item sm={9} xs={7} className={classes.root}>
            
            <Switch>
              <Route exact path="/" component={ManageStore}  />
              
              <Route exact path="/editStore/:id" component={EditStore} />
              {/* <Route exact path="/details/" component={DetailStore} /> */}
              
              <Route exact path="/orders" component={ManageOrder} />
              
              <Route exact path="/foods" component={ManageFood} />
              <Route exact path="/createFood" component={CreateFood} />
              <Route exact path="/editFood/:id" component={EditFood} />

              <Route exact path="/statistics" component={Statistics} />

              
            </Switch>
          </Grid>
          
        </Grid>
      </BrowserRouter>
    </div>
  );
}

export default SellerContent
