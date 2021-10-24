import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, TextField } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";

// const initialValues = {
//   id: "1",
//   name: "1",
//   email: "1",
//   password: "1",
//   phone: "1",
//   role: "1",
//   image: "1",
// };

function EditUser() {
  const history = useHistory();
  // const id = window.location.pathname.split("/")[3];
  let {id} = useParams()
  const [data, setData] = useState({});
  // const[initialValues, setInitialValues] = useState();
  
  const [loading, setLoading] = useState(true);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("phone" in fieldValues)
      temp.phone = fieldValues.phone ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };


  useEffect(() => {
    setLoading(true);
    // console.log(id);
    const getUser = async () => {
      const res = await api({
        // url: `/users/user/${id}`,
        url: `/users/user/${id}`,
        method: "GET",
      });
      try {
        if (res.success) {
          setData(res.user);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [id]);
  // console.log("data ", data) 

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
  useForm(data, true, validate);

  // console.log("init ", initialValues) 


  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("values: ", values);
    
    const res = await api({
      url: `/users/${id}`,
      method: "PATCH",
      data: values
    });
    try {
      if (res.success) {
        console.log("Update successfully");
        history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };



 
  console.log("data1 ", data) 

  

  // const initialValues={
  //   name: data.name,
  //   phone: data.phone,
  //   // image: data.image
  // }
  

  

  return (
    <>
      <h1>Edit User</h1>
      <div></div>
      {data && !loading && (<Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Full Name"
              defaultValue={data.name}
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              id="phone"
              type="string"
              name="phone"
              label="Phone Number"
              defaultValue={data.phone}
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <div>
              <Controls.Button type="submit" text="Submit" />
            </div>
            
          </Grid>
        </Grid>
      </Form>)}
    </>
  );
}

export default EditUser;
