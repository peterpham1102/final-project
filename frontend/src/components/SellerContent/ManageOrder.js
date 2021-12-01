import {
  InputAdornment,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { React, useEffect, useState, useContext } from "react";

import AddIcon from "@mui/icons-material/Add";
import Controls from "../../shared/components/UIElements/Controls";
import DeleteIcon from "@mui/icons-material/Delete";
import EditFood from "./EditFood";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useHistory } from "react-router-dom";
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

function ManageOrder() {
  const classes = useStyles();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState()
  const [changeStatus, setChangeStatus] = useState(false);
  const [status, setStatus] = useState()
  const [hidden, setHidden] = useState(true)
  const authValue = useContext(AuthContext);
  const { user } = authValue;
  const history = useHistory();



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
    const fetchOrdersByStore = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `orders/store/${storeId}`,

          method: "GET",
        });
        res.orders.forEach((element) => {
          element.key = element._id;
        });
        let arrOrders = []
        for (const el of res.orders) {
          arrOrders.push(el)

          // for(const name of el.store_ordered) {
          //   setOrderDataName([...el, 
          //     {foodName: name.food_name,
          //     quantity: name.quantity,}])

          // }
        }


        setStatus(res.status)
        setOrderData(res.orders);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchOrdersByStore();
  }, [storeId, changeStatus]);



  const headCells = [
    // { id: "_id", label: "Order Id " },
    // { id: "description", label: "Description" },
    { id: "order_summary", label: "Order Summary" },
    // { id: "quantity", label: "Quantity" },
    { id: "total_price", label: "Total Amount" },
    { id: "buyer", label: "Buyer" },
    { id: "destination", label: "Destination" },
    { id: "payment_method", label: "Payments" },
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
            x.buyer_id.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleChangeOrderStatus = async (key, value) => {
    const res = await api({
      url: `/orders/status/${key}`,
      method: "PATCH",
      data: { status: value },
    });
    if (res.success) {
      

      setChangeStatus(true)
      setHidden(false)
    }

    window.location.reload(false)

  }



  // const [records, setRecords] = useState(null)

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(orderData, headCells, filterFn);


  console.log("order data ", orderData)
  return (
    <>
    <h1>Manage Orders</h1>
      {/* <Toolbar>
        <Controls.Input
          label="Search Orders"
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
      </Toolbar> */}
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
              {/* <TableCell>{item._id}</TableCell> */}
              {/* <TableCell>{item.description}</TableCell> */}
              <TableCell>
                <TableCell>
                  {
                    item.store_ordered.map(i =>
                    (
                      <TableRow>
                        {i.food_name}
                      </TableRow>
                    )
                    )
                  }
                </TableCell>
                <TableCell>
                  {
                    item.store_ordered.map(i =>
                    (
                      <TableRow>
                        X {i.quantity}
                      </TableRow>

                    )
                    )
                  }
                </TableCell>
                {/* <TableRow>
                  {item.store_ordered.map(i => i.quantity)}
                </TableRow> */}
              </TableCell>
              {/* <TableCell>{item.store_ordered.map(i => i.quantity)}</TableCell> */}
              <TableCell>{item.total_price}</TableCell>
              <TableCell>{item.buyer_id.name}</TableCell>
              <TableCell>{item.destination}</TableCell>
              <TableCell>{item.payment_method}</TableCell>
              <TableCell>{item.status}</TableCell>
              {item.status === "Pending" ? (<TableCell>
                <Controls.Button
                  style={{ backgroundColor: '#3ef20c', color: '#FFFFFF' }}
                  type="submit"
                  text="Accept"

                  // backgroundColor="#3ef20c"
                  onClick={() => handleChangeOrderStatus(item.key, "Processing")}
                />

                <Controls.Button
                  style={{ backgroundColor: '#f20c0c', color: '#FFFFFF' }}
                  type="submit"
                  text="Decline"

                  // backgroundColor="#f20c0c"
                  onClick={() => handleChangeOrderStatus(item.key, "Canceled")}
                />

              </TableCell>) :
                <TableCell>
                  <Controls.Button
                    // style={{backgroundColor: '#f20c0c', color: '#FFFFFF'}}
                    type="submit"
                    text="View Details"

                  // backgroundColor="#f20c0c"
                  // onClick={() =>handleChangeOrderStatus(item.key,"Canceled")}
                  />
                </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    </>
  );
}

export default ManageOrder
