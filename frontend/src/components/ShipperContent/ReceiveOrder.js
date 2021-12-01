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

import Controls from "../../shared/components/UIElements/Controls";

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

function ReceiveOrder() {
  const classes = useStyles();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
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
    const fetchProcessingOrder = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `orders/status/processing`,

          method: "GET",
        });
        res.orders.forEach((element) => {
          element.key = element._id;
        });    
        setOrderData(res.orders);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchProcessingOrder();
  }, []);



  const headCells = [
    { id: "order_summary", label: "Order Summary" },
    
    { id: "total_price", label: "Total Amount" },
    { id: "destination", label: "Destination" },
    { id: "payment_method", label: "Payment Method" },
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

  const handleChangeOrderStatus = async (key, value) => {

    const res = await api({
      url: `/orders/status/${key}`,
      method: "PATCH",
      data: { status: value },
    });
    
    const resShipping = await api({
      url: `/shippings`,
      method: "POST",
      data: { order_id: key },
    })

    if (res.success && resShipping.success) {
      

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
    <h1>Incoming Orders</h1>
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
              <TableCell>{item.destination}</TableCell>
              <TableCell>{item.payment_method}</TableCell>
              <TableCell>{item.status}</TableCell>
              
              {item.status === "Processing" ? (<TableCell>
                <Controls.Button
                  style={{ backgroundColor: '#3ef20c', color: '#FFFFFF' }}
                  type="submit"
                  text="Accept"

                  // backgroundColor="#3ef20c"
                  onClick={() => handleChangeOrderStatus(item.key, "Delivering")}
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

export default ReceiveOrder
