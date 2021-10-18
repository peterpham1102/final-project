import Footer from "../../shared/util/Footer/Footer";
import Header from "../../shared/util/Header/Header";
import LeftBar from "../../shared/util/LeftBar/LeftBar";
import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  page: {
    // backgroundColor: "#f9f9f9",
    
  }

}));

function AdminLayout({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      
      <div className={classes.page}>{children}</div>
      {/* <Footer /> */}
      
    </div>
  );
}

export default AdminLayout;
