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

function ShipperOrders() {

  const classes = useStyles();
  const [shippingData, setShippingData] = useState([]);
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

  useEffect(() => {
    const fetchShippingsByUser = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `orders/user/shipper/${user.userId}`,

          method: "GET",
        });
        res.orders.forEach((element) => {
          element.key = element._id;
        });
        setStatus(res.status)
        setShippingData(res.orders);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchShippingsByUser();
  }, [user.userId]);
  const headCells = [

    { id: "order_summary", label: "Order Summary" },
    // { id: "quantity", label: "Quantity" },
    { id: "total_price", label: "Total Amount" },
    { id: "destination", label: "Destination" },
    { id: "payment_method", label: "Payment Method" },
    { id: "status", label: "Status" },
    // { id: "actions", label: "Actions", disableSorting: true },
  ];

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(shippingData, headCells, filterFn);

  // const headCells = [
  //   { id: "shipping_id", label: "Shippng Id" },
  //   { id: "order_id", label: "Order Id" },
  //   { id: "estimated_time", label: "Payment Method" },
  //   { id: "actions", label: "Actions", disableSorting: true },
  // ];
  console.log("shippingData ", shippingData)

  
  return (
    <>
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
     <h1>My Orders</h1>
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
                    item.order_id.store_ordered.map(i =>
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
                    item.order_id.store_ordered.map(i =>
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
              <TableCell>{item.order_id.total_price}</TableCell>
              <TableCell>{item.order_id.destination}</TableCell>
              <TableCell>{item.order_id.payment_method}</TableCell>
              <TableCell>{item.order_id.status}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    
    </>
  )
}

export default ShipperOrders
