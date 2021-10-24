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

function ShopInfo(props) {
  const classes = useStyles();

  const authValue = useContext(AuthContext);
  const { user } = authValue;

  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopByUser = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `stores/user/${user.userId}`,
          
          method: "GET",
        });
        setShopData(res.store);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchShopByUser();
  }, [user.userId]);
  
 

  console.log("shopData: ",shopData)
  console.log("shopData: ", typeof(shopData.rating))
  return (
    <>
      
      {shopData && !loading && (<Grid container classes={classes.root}>
        <Grid item xs={5}>
          <Card classes={classes.card}>
            <CardMedia
              component="img"
              height="300px"
              width="300px"
              image={shopData.image}
              alt="green iguana"
            />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <List classes={classes.list}>
            <ListItemText primary={shopData.name} />
            <ListItemText primary={shopData.location} />
            <ListItemText primary={shopData.description} />
            <ListItemText primary={shopData.voucher} />
            
            <Rating name="read-only" defaultValue={shopData.rating} readOnly />
            {/* <ListItemText primary={shopData.rating} /> */}
          </List>
        </Grid>
      </Grid>)}
    </>
  );
}

export default ShopInfo;
