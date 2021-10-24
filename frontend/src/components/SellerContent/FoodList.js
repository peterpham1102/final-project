import { React, useContext, useEffect, useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";

import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import FoodItem from "./FoodItem";
import { Link } from "react-router-dom";
import api from "../../shared/util/api";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ffffff",
  },
  title: {
    margin: theme.spacing(2),
  },
  foodName: {
    margin: theme.spacing(3),
  },
  list: {},
  button: {},
  right: {
    display: "flex",
  },
}));

function FoodList() {
  const classes = useStyles();
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState();
  const authValue = useContext(AuthContext);
  const { user } = authValue;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `users/user/${user.userId}`,
          method: "GET",
        });
        setStoreId(res.user.store_owned_id);
        console.log("(res.user.store_owned_id ", res.user.store_owned_id);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);
  console.log("storeId ", storeId);

  useEffect(() => {
    setLoading(true);
    const fetchFoodsByStore = async () => {
      console.log("storeId ", storeId);
      try {
        const res = await api({
          url: `foods/store/${storeId}`,
          method: "GET",
        });
        if (res.success) {
          setFoodData(res.foods);
          console.log("res.foods ", res.foods);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFoodsByStore();
  }, [storeId]);
  console.log("food data ", foodData);
  // console.log("food data: ", foodData)

  return (
    <>
      {/* {!loading &&
        foodData &&( <Typography variant="h5">Most Popular Foods</Typography> )&&
        foodData.map((item) => (
          <FoodItem
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
          />
        )) && (
          <Link to={"/editStore/" + storeId}>
            <Controls.Button text="Edit Store" />
          </Link>
        )} */}
      {!loading && <Typography variant="h5">Most Popular Foods</Typography>}
      {!loading &&
        foodData &&
        foodData.map((item) => (
          <FoodItem
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
          />
        ))}
      {!loading && (
        <Link to={"/editStore/" + storeId}>
          <Controls.Button text="Edit Store" />
        </Link>
      )}
      {/* <Link to={"/editStore/" + storeId}>
        <Controls.Button text="Edit Store" />
      </Link> */}
    </>
  );
}

export default FoodList;
