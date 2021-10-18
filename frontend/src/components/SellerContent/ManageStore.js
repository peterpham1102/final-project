import { React, useContext, useEffect } from "react";

import { AuthContext } from "../../App";
import CreateStore from "./CreateStore";
import DetailStore from "./DetailStore";

function ManageStore() {

  const authValue = useContext(AuthContext);
  const { user} = authValue;
  

  return (
    <>
    {user.storeOwnedId ? <DetailStore /> : <CreateStore /> }
    </>
  )
}

export default ManageStore
