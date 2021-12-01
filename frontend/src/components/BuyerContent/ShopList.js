import { Grid, InputAdornment, makeStyles } from "@material-ui/core";
import { React, useEffect, useState, useContext } from "react";

import { Link } from 'react-router-dom'
import ShopItem from "./ShopItem";
import api from "../../shared/util/api";
import Controls from "../../shared/components/UIElements/Controls";
import { AuthContext } from "../../App";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  shopList: {
    marginTop: theme.spacing(5),
  }
}));

function ShopList() {

  const classes = useStyles();
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);

  const authValue = useContext(AuthContext);
  const { user } = authValue;

  const [searchInput, setSearchInput] = useState('');

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


  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '') {
      const filteredData = storeData.filter((item) => {
        return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
      })
      setFilteredResults(filteredData)
    }
    else {
      setFilteredResults(storeData)
    }

  }

  return (
    <>
      <div style={{textAlign: 'center'}}>
      <Controls.Input
        label="Search Stores..."
        fullWidth
        className={classes.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        onChange={(e) => searchItems(e.target.value)}
      />
      </div>
      <Grid container spacing={4} className={classes.shopList}>
      {searchInput.length > 1 ? (
        filteredResults.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <ShopItem data={item} />
            </Grid>
          ) 
        })
      ) : ( !loading && storeData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <ShopItem data={item} />
          </Grid>
        ))
      )}


    </Grid>

    </>
  );
}

export default ShopList;
