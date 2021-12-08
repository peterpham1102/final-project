import { Form, useForm } from "../../shared/hooks/useForm";
import {
  Grid,
} from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";
import Notification from "../../shared/components/UIElements/Notification";


function EditCategory() {
  const history = useHistory();
  // const id = window.location.pathname.split("/")[3];
  let { id } = useParams()
  const [data, setData] = useState({});
  // const[initialValues, setInitialValues] = useState();
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  const [loading, setLoading] = useState(true);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("description" in fieldValues)
      temp.description = fieldValues.description ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };


  useEffect(() => {
    setLoading(true);
    // console.log(id);
    const getCategory = async () => {

      const res = await api({
        // url: `/categories/category/${id}`,
        url: `/categories/${id}`,
        method: "GET",
      });
      try {
        // if (res.success) {

        setData(res.category);
        setLoading(false);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();

  }, [id]);
  // console.log("data ", data) 

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(data, true, validate);

  // console.log("init ", initialValues) 


  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("values: ", values);
    if (validate()) {
      const res = await api({
        url: `/categories/${id}`,
        method: "PATCH",
        data: values
      });
      try {
        // if (res.success) {
        console.log("Update successfully");
        setNotify({
          isOpen: true,
          message: 'Edit category successfully!',
          type: 'success'
        })
        history.push("/categories");
        // }
      } catch (error) {
        console.log(error);
      }
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
      <h1>Edit Category</h1>

      {data && !loading && (<Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>

            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Category Name"
              defaultValue={data.name}
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              id="description"
              type="string"
              name="description"
              label="Description"
              defaultValue={data.description}
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
            <div>
              <Controls.Button type="submit" text="Submit" />
            </div>

          </Grid>
        </Grid>
      </Form>)}
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
}

export default EditCategory;
