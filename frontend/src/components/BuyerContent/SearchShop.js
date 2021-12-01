// import { Grid, makeStyles } from "@material-ui/core";
// import { React, useEffect, useState, useContext } from "react";

// import { Link } from 'react-router-dom'
// import ShopItem from "./ShopItem";
// import api from "../../shared/util/api";
// import Controls from "../../shared/components/UIElements/Controls";
// import { AuthContext } from "../../App";

// const useStyles = makeStyles((theme) => ({
//   shopList: {
//     marginTop: theme.spacing(5),
//   }
// }));




// function SearchShop() {
//   const [searchKey, setSearchKey] = useState('')
//   const [searchShopData, setSearchShopData] = useState('')
//   const handleSubmit = async () => {
//     setLoading(true)
//     try {
//       const res = await api({
//         url: `stores/search/${searchKey}`,
//         method: "GET",
//       })
//       if (res.stores) {
//         setSearchShopData(res.stores)
//         setLoading(false)
//       }
//     } catch (err) {
//       console.log(err)
//     }


//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//             <div style={{ top: 70, left: 500, position: "absolute" }}>
//               <Controls.Input
//                 style={{ width: "200%" }}
//                 label="Search..."
//                 type="string"
//                 value=""
//                 onChange={(e) => { setSearchKey(e.target.value) }}
//               />
//             </div>

//             <div style={{ top: 70, right: 480, position: "absolute" }}>
//               <Controls.Button
//                 style={{ backgroundColor: '#00a7fa', color: '#FFFFFF' }}
//                 type="submit"
//                 text="Search"

//               // backgroundColor="#f20c0c"
//               // onClick={() => handleChangeOrderStatus(item.key, "Canceled")}
//               />
//             </div>
//           </form>
//       {searchShopData.map((item) => (
//             <Grid item xs={12} sm={6} md={4} key={item._id}>
//               <ShopItem data={item} />
//             </Grid>
//           ))}
//     </div>
//   )
// }

// export default SearchShop
