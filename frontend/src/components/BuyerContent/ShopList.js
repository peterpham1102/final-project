import { Grid, makeStyles } from "@material-ui/core";
import { React, useEffect, useState } from "react";

import {Link} from 'react-router-dom'
import ShopItem from "./ShopItem";
import api from "../../shared/util/api";

const useStyles = makeStyles((theme) => ({
  shopList: {
    marginTop: theme.spacing(5),
  }
}));

function ShopList() {
  const classes = useStyles();
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: "stores",
          method: "GET",
        });
        console.log(res);
        console.log(res.stores);

        res.stores.forEach((element) => {
          element.key = element._id;
        });
        setStoreData(res.stores);
        setLoading(false);
      } catch (error) {
        console.log("error: " + error);
        setLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  return (
    <>
      {!loading && storeData && (
        <Grid container spacing={4} className={classes.shopList}>
          {storeData.map((item) => (
            <Grid item xs={12} sm={6} md={4}>
              
              <ShopItem data={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default ShopList;
