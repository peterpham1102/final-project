import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, TextField } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";

function EditStore() {
  const history = useHistory();
  // const storeId = window.location.pathname.split("/")[3];
  let {id} = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  // const [image, setImage] = useState();
  // const [url, setUrl] = useState("");

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
    const getStore = async () => {
      setLoading(true);
      console.log("storeId ", id)
      const res = await api({
        url: `/stores/store/${id}`,
        method: "GET",
      });
      try {
        // if (res.success) {
          setData(res.store);
          setLoading(false);

        // }
      } catch (err) {
        console.log(err);
      }
    };
    getStore();
  }, [id]);
  console.log("data ", data)

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(data, true, validate);

  // console.log("init ", initialValues)

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("values: ", values);

    const res = await api({
      url: `/stores/${id}`,
      method: "PATCH",
      data: values,
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

  console.log("data1 ", data);

  return (
    <>
      <h1>Edit Store</h1>
      <div></div>
      {data && !loading && (<Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Store Name"
              defaultValue={data.name}
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              id="location"
              type="string"
              name="location"
              label="Address"
              defaultValue={data.location}
              value={values.location}
              onChange={handleInputChange}
              error={errors.location}
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
            {/* <Controls.Button
              variant="contained"
              component="label"
              text="Upload Image"
            >
            <input
              id="image"
              accept="image/*"
              type="file"
              hidden
              name="image"
              value={values.image}
              onChange={(e) => setImage(e.target.files[0])}
            />
            </Controls.Button>

            <div>
              <img src={url || "http://via.placeholder.com/300"} height="300px" width="300px" alt="store-image" />
            </div> */}
            <div style={{textAlign: 'center'}}>
              <Controls.Button type="submit" text="Submit" />
            </div>
            
          </Grid>
        </Grid>
      </Form>)}
    </>
  );
}

export default EditStore;
