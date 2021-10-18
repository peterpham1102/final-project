// import { Container, Typography, makeStyles } from "@material-ui/core";
// import { Link, Route, Switch } from "react-router-dom";

// import { Home } from "@material-ui/icons";
// import React from "react";

// const useStyles = makeStyles((theme) => ({
//   container: {
  
//     height: "100vh",
//     color: "white",
//     paddingTop: theme.spacing(12),
//     backgroundColor: theme.palette.primary.main,
//     // position: "sticky",
//     top: theme.spacing(8),
//     [theme.breakpoints.up("sm")]: {
//       backgroundColor: "#039be5",
//       color: "#555",
//       border: "1px solid #ece7e7",
//     },
//   },
//   item: {
//     color: "#ffffff",
//     display: "flex",
//     alignItems: "center",
//     marginBottom: theme.spacing(4),
//     [theme.breakpoints.up("sm")]: {
//       marginBottom: theme.spacing(3),
//       cursor: "pointer",
//     },
//   },
//   icon: {
//     color: "#ffffff",
//     marginRight: theme.spacing(1),
//     marginLeft: theme.spacing(2),
//     [theme.breakpoints.up("sm")]: {
//       fontSize: "18px",
//     },
//   },
//   text: {
//     color: "#ffffff",
//     fontWeight: 500,
//     [theme.breakpoints.down("sm")]: {
//       display: "none",
//     },
//   },
// }));
// function LeftBar() {
//   const classes = useStyles();
//   return (
//     <>
//       <Container className={classes.container}>
//         <Link to="/test" style={{ textDecoration: "none" }}>
//           <div className={classes.item}>
//             <Home className={classes.icon} />
//             <Typography className={classes.text}>Homepage</Typography>
//           </div>
//         </Link>
//         <Link to="/test1" style={{ textDecoration: "none" }}>
//           <div className={classes.item}>
//             <Home className={classes.icon} />
//             <Typography className={classes.text}>Homepage</Typography>
//           </div>
//         </Link>
//       </Container>
      
//     </>
//   );
// }

// export default LeftBar;
