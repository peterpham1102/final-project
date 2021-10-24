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


function FoodList({data}) {
  return (
    <>
    <Typography variant="h5">Most Popular Foods</Typography>
    <div>
        {data.map((item) => (
          <FoodItem
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
          />
        ))}
        </div>
    </>
  )
}

export default FoodList
