import {
  InputAdornment,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import { React, useEffect, useState, useContext } from "react";

import AddIcon from "@mui/icons-material/Add";
import Controls from "../../shared/components/UIElements/Controls";
import DeleteIcon from "@mui/icons-material/Delete";
import EditFood from "./EditFood";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";
import api from "../../shared/util/api";
import useTable from "../../shared/hooks/useTable";
import { AuthContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));
function ManageFood() {
  const classes = useStyles();
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState()
  const authValue = useContext(AuthContext);
  const { user } = authValue;



  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

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

  useEffect(() => {
    const fetchFoodsByStore = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `foods/store/${storeId}`,
          
          method: "GET",
        });
        res.foods.forEach((element) => {
          element.key = element._id;
        });
        setFoodData(res.foods);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchFoodsByStore();
  }, [storeId]);


  const headCells = [
    { id: "name", label: "Food Name" },
    { id: "description", label: "Description" },
    { id: "image", label: "Image" },
    { id: "price", label: "Price" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  // const [records, setRecords] = useState(null)

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(foodData, headCells, filterFn);

  return (
    <>
      <Toolbar>
        <Controls.Input
          label="Search Foods"
          className={classes.searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />
        <Link to="/createFood">
          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
          />
        </Link>
      </Toolbar>
      {/* <Link to="/createFood">
      <Controls.Button
        className={classes.newButton}
        text="Add New"
        variant="outlined"
        startIcon={<AddIcon />}
      ></Controls.Button>
    </Link> */}
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.key}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <img src={item.image} height="100px" width="100px" alt="Food Image"/>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Link to={"/editFood/" + item.key}>
                  <Controls.ActionButton>
                    <EditIcon />
                  </Controls.ActionButton>
                </Link>
                <Link>
                  <Controls.ActionButton>
                    <DeleteIcon />
                  </Controls.ActionButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    </>
  );
}

export default ManageFood;
