import { React, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../App";
import CreateStore from "./CreateStore";
import DetailStore from "./DetailStore";
import api from "../../shared/util/api";

function ManageStore() {

  const [storeOwnedId, setStoreOwnedId] = useState()
  const [loading, setLoading] = useState(true)
  const authValue = useContext(AuthContext);
  const { user} = authValue;
  
  useEffect(() => {
    const fetchUserById = async() => {
      setLoading(true)
      try {
        const res = await api({
          url: `users/user/${user.userId}`,
          method: "GET"
        });
          setStoreOwnedId(res.user.store_owned_id)
          setLoading(false);
        
      } catch (err) {
        console.log(err)
      }
    }
    fetchUserById()
  },[storeOwnedId])
  console.log("store own id" ,storeOwnedId)
  
 

  return (
    <>
    
    {!loading && storeOwnedId && (<DetailStore storeOwnedId={storeOwnedId} />)}
    {!loading && !storeOwnedId && (<CreateStore /> )}
    </>
  )
}

export default ManageStore
