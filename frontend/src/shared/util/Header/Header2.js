import {
  AppBar,
  Avatar,
  Badge,
  InputBase,
  Toolbar,
  Typography,
  alpha,
  makeStyles,
} from "@material-ui/core";
import { Cancel, Mail, Notifications, Search } from "@material-ui/icons";
import { React, useContext, useState } from "react";

import { AuthContext } from "../../../App";
import Logo from "../../../wtf_logo.jpg";
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from "react-router-dom";

// import {LogoutIcon} from '@mui/icons-material';




const useStyles = makeStyles((theme) => ({
  toolbar: {
    // backgroundColor:'red',
    display: "flex",
    justifyContent: "space-between",
  },
  bannerLg: {
    alignItems: "center",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    marginLeft: theme.spacing(1)
  },
  bannerSm: {
    alignItems: "center",
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    marginLeft: theme.spacing(1)
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
  input: {
    color: "white",
    marginLeft: theme.spacing(1),
  },
  cancel: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  searchButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  icons: {
    
    marginLeft: theme.spacing(2),
    alignItems: "center",
    display: (props) => (props.open ? "none" : "flex"),
  },
  logout: {
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
      cursor: "pointer"
    },
    marginLeft: theme.spacing(2),
    alignItems: "center",
    display: (props) => (props.open ? "none" : "flex"),
  },
  categories: {
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
  },
  logo: {
    display: 'flex',
    marginRight: theme.spacing(2),
  },
  badge: {
    marginRight: theme.spacing(2),
  },
  top: {
    height: theme.spacing(8)
  }
}));
function Header2() {

  const authValue = useContext(AuthContext);
  const { logout } = authValue;
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });
  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logo}>
          <img src={Logo} alt="WTFood Logo" height="40rem" width="40rem" />
          <Typography variant="h6" className={classes.bannerLg}>
            What The Food
          </Typography>
          <Typography variant="h6" className={classes.bannerSm}>
            WTFood
          </Typography>
        </div>
          {/* <Typography variant="h6" className={classes.bannerLg}>
            What The Food
          </Typography>
          <Typography variant="h6" className={classes.bannerSm}>
            WTFood
          </Typography> */}

        {/* <div className={classes.categories}>
          <Typography variant="h6">Drinks</Typography>
          </div>
          <div className={classes.categories}>
          <Typography variant="h6">Cafe</Typography>
          </div>
          <div className={classes.categories}>
          <Typography variant="h6">Fast Food</Typography>
        </div> */}
        <div className={classes.search}>
          <Search />
          <InputBase placeholder="Search..." className={classes.input} />
          <Cancel className={classes.cancel} onClick={() => setOpen(false)} />
        </div>
        <div className={classes.icons}>
          <Search
            className={classes.searchButton}
            onClick={() => setOpen(true)}
          />
        <Badge badgeContent={4} color="secondary" className={classes.badge}>
            <Mail />
          </Badge>
          <Badge badgeContent={2} color="secondary" className={classes.badge}>
            <Notifications />
          </Badge>
          <Avatar
            alt="Shadow Fiend"
            src="https://www.wallpapertip.com/wmimgs/92-921303_data-src-w-full-c-3-1-539439.jpg"
          />
          <LogoutIcon className={classes.logout} onClick={()=> {
            logout();
            history.push("/");
          }}/>
        </div>
      </Toolbar>
    </AppBar>



  // <div className={classes.top}>
  //   Hello
  // </div>
  );
}

export default Header2;
