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
import FoodList from "./FoodList";
import { Rating } from "@mui/material";
import ShopBill from "./ShopBill";
import ShopInfo from "./ShopInfo";
import api from "../../shared/util/api";
import { useParams } from "react-router-dom";
import { useCart, CartProvider } from 'react-use-cart'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
  },
}));

function DetailShop() {
  const classes = useStyles();
  let { id } = useParams();
  const [shopData, setShopData] = useState({});
  const [foodData, setFoodData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopById = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `stores/store/${id}`,

          method: "GET",
        });
        setShopData(res.store);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchShopById();

    const fetchFoodsByStore = async () => {
      setLoading(true);
      console.log("storeId ", id);
      try {
        const res = await api({
          url: `foods/store/${id}`,
          method: "GET",
        });
        // if (res.success) {
          res.foods.forEach((element) => {
            element.key = element._id;
          });
          setFoodData(res.foods);
          console.log("res.foods ", res.foods);
          setLoading(false);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFoodsByStore();
  }, [id]);
  console.log("shopData ", shopData);

  return (
    <>
      <Grid container spacing={4} className={classes.root}>
        <Grid item xs={2} sm={2}></Grid>
        <Grid item xs={7} sm={7}>
          {!loading && shopData && <ShopInfo data={shopData} />}
        </Grid>
        <Grid item xs={3} sm={3}></Grid>
      </Grid>
      <CartProvider>
      <Grid container  >
        {!loading && foodData && <FoodList data={foodData}  />}
      </Grid>
      </CartProvider>
    </>
  );
}

export default DetailShop;
