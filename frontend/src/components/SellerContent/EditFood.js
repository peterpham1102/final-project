import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, TextField } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";

function EditFood() {
  const history = useHistory();
  // const foodId = window.location.pathname.split("/")[3];
  let {id} = useParams();
  const [data, setData] = useState({});
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

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  useEffect(() => {
    const getFood = async () => {
      setLoading(true);
      console.log("foodId ", id)
      const res = await api({
        url: `/foods/food/${id}`,
        method: "GET",
      });
      try {
        // if (res.success) {
          setData(res.food);
          setLoading(false);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    getFood();
  }, [id]);
  console.log("data ", data)

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(data, true, validate);

  // console.log("init ", initialValues)

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("values: ", values);

    const res = await api({
      url: `/foods/${id}`,
      method: "PATCH",
      data: values,
    });
    try {
      // if (res.success) {
        console.log("Update successfully");
        history.push("/foods");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("data1 ", data);

  return (
    <>
      <h1>Edit Food</h1>
      <div></div>
      {data && !loading && (<Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Food Name"
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
            <Controls.Input
              id="price"
              type="string"
              name="price"
              label="Price"
              defaultValue={data.price}
              value={values.price}
              onChange={handleInputChange}
              error={errors.price}
            />
            <div style={{textAlign: 'center'}}>
              <Controls.Button type="submit" text="Submit" />
            </div>
            
          </Grid>
        </Grid>
      </Form>)}
    </>
  );
}

export default EditFood
