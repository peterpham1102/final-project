import { AccountBox, Insights, Store } from "@mui/icons-material";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Container, makeStyles } from "@material-ui/core";
import { Grid, Typography } from "@mui/material";

import CreateUser from "./CreateUser";
import EditStore from "./EditStore";
import EditUser from "./EditUser";
import ExportData from "./ExportData";
import ImportData from "./ImportData";
import ManageStore from "./ManageStore";
import ManageUser from "./ManageUser";
import React from "react";
import Statistics from "./Statistics";

// import LeftBar from "../../shared/util/LeftBar/LeftBar";

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

function AdminContent() {
  const classes = useStyles();
  return (
    <div>
      <BrowserRouter basename="admin">
        <Grid container>
          <Grid item sm={2} xs={2}>
            <Container className={classes.container}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <AccountBox className={classes.icon} />
                  <Typography className={classes.text}>Manage Users</Typography>
                </div>
              </Link>
              <Link to="/stores" style={{ textDecoration: "none" }}>
                <div className={classes.item}>
                  <Store className={classes.icon} />
                  <Typography className={classes.text}>
                    Manage Stores
                  </Typography>
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
            {/* <ManageUser /> */}
            
            <Switch>
              <Route exact path="/" exact component={ManageUser} />
              <Route exact path="/createUser" component={CreateUser} />
              <Route exact path="/editUser/:id" component={EditUser} />
              <Route exact path="/stores" component={ManageStore} />
              
              <Route exact path="/editStores/:id" component={EditStore} />
              <Route exact path="/statistics" component={Statistics} />
              <Route exact path="/export" component={ExportData} />
              <Route exact path="/import" component={ImportData} />
            </Switch>
          </Grid>
          
        </Grid>
      </BrowserRouter>
    </div>
  );
}

export default AdminContent;
