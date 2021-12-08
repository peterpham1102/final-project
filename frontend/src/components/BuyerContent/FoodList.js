import {
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  CardActionArea,
  MenuItem,
} from "@material-ui/core";
import {
  React,
  useContext,
  useEffect,
  useState
} from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FoodItem from "./FoodItem";
import { Link } from "react-router-dom";
import ShopBill from "./ShopBill";
import api from "../../shared/util/api";
import { useCart, CartProvider } from 'react-use-cart'
// import { useCart, CartProvider } from '../../shared/hooks/useCart'
import Popup from "../../shared/components/UIElements/Popup";
import Notification from "../../shared/components/UIElements/Notification";
import ConfirmDialog from "../../shared/components/UIElements/ConfirmDialog";
import { Form, useForm } from "../../shared/hooks/useForm";
import { useHistory, useParams } from "react-router";
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
  buttonMinus: {
    backgroundColor: '#f20c0c'
  },
  buttonPlus: {
    // fontSize: theme.spacing(2),
    // size: "small"
    backgroundColor: '#3ef20c'
  },
  card: {
    background: "white",
    // position: "-webkit-sticky",
    position: "sticky",

    top: theme.spacing(10),
    bottom: 20,
    margin: 20,
    paddingTop: "20px",
    paddingBottom: "20px",

    // zIndex: 5,
  },
  card2: {
    background: "white",
    // position: "-webkit-sticky",
    position: "sticky",

    top: theme.spacing(10),
    bottom: 10,
    margin: 10,

    paddingBottom: "20px",

    // zIndex: 5,
  },
  cartItem: {
    display: 'flex',
    backgroundColor: '#ebebeb',
    padding: 3
  },
  actionButton: {
    "&:hover": {
      // backgroundColor: alpha(theme.palette.common.black, 0.25),
      backgroundColor: "#ffffff",
      cursor: "pointer"
    },
  }

}));

const initialValues = {
  id: "",
  destination: "",
  description: "",
  payment_method: "",

};

function FoodList(props) {
  const { data } = props;
  const {
    addItem,
    items,
    totalItems,
    totalUniqueItems,
    isEmpty,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart

  } = useCart()

  const classes = useStyles();
  const [orderData, setOrderData] = useState({ items });
  const [orderFood, setOrderFood] = useState();
  const [loading, setLoading] = useState();
  const [storeOrder, setStoreOrder] = useState({ id: '', quantity: '' });
  const [orderQuantity, setOrderQuantity] = useState()
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [disableCheckout, setDisableCheckout] = useState(true)

  const history = useHistory();
  const [listFoodId, setListFoodId] = useState()
  let { id } = useParams()


  // const [foodCount, setFoodCount] = useState(0);

  useEffect(() => {
    // setOrderFood(items.map(item => item._id))
    // setOrderQuantity(items.map(item => item.quantity))
    // console.log("items ", items)
    // console.log("items id ", items.map(item => item._id))
    const fetchShopById = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `stores/store/${id}`,

          method: "GET",
        });
        setListFoodId(res.store.foods_id);
        setLoading(false);
      } catch (err) {
        console.log("err ", err);
      }
    };
    fetchShopById();

  }, [id])

  console.log("list food id ", listFoodId)


  if (!loading && listFoodId && !listFoodId.some(id => items.map(item => item._id).includes(id))) {
    emptyCart();
  }



  useEffect(() => {
    if (items.length !== 0) {
      setDisableCheckout(false)
    }
    else {
      setDisableCheckout(true)
    }
  },[items.length])

  

  const handleCheckout = () => {

    setOpenPopup(true)
  };
  console.log("items ", items)
  console.log("items length", items.length)

  let arrStore = []

  arrStore = items.map(item => {
    let store = { food_id: '', quantity: '' }

    store.food_id = item._id
    store.quantity = item.quantity
    return store
  })


  console.log("arrStore", arrStore)

  console.log("test ", items)

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("destination" in fieldValues)
      temp.destination = fieldValues.destination ? "" : "This field is required.";
    if ("description" in fieldValues)
      temp.description = fieldValues.description ? "" : "This field is required.";
    if ("payment_method" in fieldValues)
      temp.payment_method = fieldValues.payment_method ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    if (validate()) {

      const res = await api({
        url: "orders",
        method: "POST",
        data: {
          ...values,
          store_ordered: arrStore
        },
      });
      try {
        if (res.success) {
          setNotify({
            isOpen: true,
            message: 'Create order successfully!',
            type: 'success'
          })
          console.log("Create order successfully!");
          history.push("/");
          resetForm();
        }
      } catch (err) {
        setNotify({
          isOpen: true,
          message: 'Create order failed, please try again!',
          type: 'error'
        })
        console.log(err);
      }
    }
  }
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  return (
    <>
      <CartProvider >
        <Grid container>
          <Grid item xs={2} sm={2}></Grid>
          <Grid item xs={7} sm={7}>
            <Typography variant="h5" style={{ paddingTop: 20 }}>Most Popular Foods</Typography>
            <div>
              {data.map((item, index) => (
                <FoodItem
                  key={item._id}
                  image={item.image}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  // item={item}
                  onClick={() => addItem(item)}
                />
              ))}
            </div>
          </Grid>
          {!loading && listFoodId && <Grid item xs={3} sm={3}>
            <Card elevation={2} className={classes.card}>

              <CardContent>
                <Typography variant="h5" style={{ textAlign: 'center' }}>Order summary</Typography>
                <Typography style={{ textAlign: 'right' }}>{totalUniqueItems} Foods</Typography>
                {items.map((item) => (
                  <>
                    <div className={classes.cartItem}>

                      <AddCircleOutlineIcon
                        className={classes.actionButton}
                        style={{ fill: "#3ef20c" }}


                        onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                      />
                      <Typography>{item.quantity}</Typography>

                      <RemoveCircleOutlineIcon
                        className={classes.actionButton}
                        style={{ fill: "#f20c0c" }}

                        onClick={() => updateItemQuantity(item._id, item.quantity - 1)} />

                      <Typography style={{ textAlign: 'right', marginLeft: 10 }}>{item.name}</Typography>
                    </div>
                    <Typography style={{ textAlign: 'right' }}>{item.price * item.quantity}$</Typography>

                  </>
                ))}
                <Typography variant="h6" style={{ textAlign: 'right', color: '#4a8af7' }}>Total: {cartTotal}$</Typography>
                <div style={{ textAlign: 'center' }}>
                  <Controls.Button
                    text="Clear Bill"
                    variant="outlined"
                    className={classes.button}
                    onClick={() => emptyCart()}
                  />
                  <Controls.Button
                    text="Checkout"
                    variant="outlined"
                    className={classes.button}
                    disabled={disableCheckout}
                    onClick={() => handleCheckout()}
                  />
                </div>


              </CardContent>
            </Card>
          </Grid>}
        </Grid>
        <Popup
          variant="h3"

          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <Card className={classes.card2}  >
            <CardContent >
              <Typography variant="h3" style={{ textAlign: 'center', textEmphasisStyle: 'bold' }}>Order Details</Typography>
              <Typography style={{ textAlign: 'right' }}>Number of Foods: {totalUniqueItems}</Typography>
              {items.map((item) => (
                <>
                  <div className={classes.cartItem}>
                    <Typography>{item.quantity} x </Typography>
                    <Typography style={{ marginLeft: 10 }}>{item.name}</Typography>
                  </div>
                  <Typography style={{ textAlign: 'right' }}>{item.price * item.quantity}$</Typography>
                </>
              ))}
              <Typography variant="h6" style={{ textAlign: 'right', color: '#4a8af7' }}>Total: {cartTotal}$</Typography>
              <Form onSubmit={handlePlaceOrder}>
                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Controls.Input
                      id="destination"
                      type="string"
                      label="Destination"
                      name="destination"
                      value={values.destination}
                      onChange={handleInputChange}
                      error={errors.destination}
                    />
                    <Controls.Input
                      id="description"
                      type="string"
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleInputChange}
                      error={errors.description}
                    />
                    {/* <Controls.Input
                      id="payment_method"
                      type="string"
                      label="Payment Method"
                      name="payment_method"
                      value={values.payment_method}
                      onChange={handleInputChange}
                      error={errors.payment_method}
                    /> */}
                    <Controls.Select
                      name="payment_method"
                      label="Payment Method"
                      value={values.payment_method}
                      onChange={handleInputChange}
                      error={errors.payment_method}
                    >
                      <MenuItem value="ship_cod">Ship COD</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                      <MenuItem value="stripe">Stripe</MenuItem>
                    </Controls.Select>
                    <Controls.Button
                      type="submit"
                      text="Place Order"

                    />
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        </Popup>

        <Notification
          notify={notify}
          setNotify={setNotify}
        />
        {/*
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            /> */}
      </CartProvider>

    </>
  );
}

export default FoodList;
