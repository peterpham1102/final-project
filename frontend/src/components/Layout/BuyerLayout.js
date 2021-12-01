import Footer from "../../shared/util/Footer/Footer";
import Header from "../../shared/util/Header/Header";
import React from "react";
import { makeStyles } from "@material-ui/core";
import BuyerHeader from "../../shared/util/Header/Header";

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: "#f9f9f9",  
  }
}));

function BuyerLayout({ children }) {
  const classes = useStyles();

  return (
    <div>
      <BuyerHeader/>
      {/* <Header /> */}
      <div className={classes.page}>{children}</div>
      {/* <Footer /> */}
      
    </div>
  )
}

export default BuyerLayout;
