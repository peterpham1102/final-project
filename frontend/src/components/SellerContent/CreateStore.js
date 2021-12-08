import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, MenuItem, makeStyles } from "@material-ui/core";
import { React, useEffect, useState } from "react";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";
import storage from "../firebase";
import { useHistory } from "react-router";

// import storage from "../firebase";

const useStyles = makeStyles((theme) => ({}));

const initialValues = {
  id: "",
  name: "",
  location: "",
  description: "",
  voucher: "",
  image: "",
  rating: "",
};


function CreateStore() {
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState();
  const history = useHistory();

  useEffect(() => {
    console.log("image: ", image)
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
            });
        }
      );
    }
  }, [image]);
  console.log(image)

  const handleSubmit = async (event) => {
    console.log("values ", values)
    event.preventDefault();
    console.log(url)
    if(validate()) {
    const res = await api({
      url: "stores",
      method: "POST",
      data: {
        ...values,
        image: url,
      },
    });
    try {
      if (res.success) {
        console.log("Create store successfully!");
        history.push("/");
        resetForm();
        
      }
    } catch (err) {
      console.log(err);
    }
    window.location.reload(true)
    
  }
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("location" in fieldValues)
      temp.location = fieldValues.location ? "" : "This field is required.";
    if ("description" in fieldValues)
      temp.description = fieldValues.description ? "" : "This field is required.";
    
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };


  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  return (
    <>
      <h1>Create Store</h1>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Store Name"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />

            <Controls.Input
              id="location"
              type="string"
              label="Address"
              name="location"
              value={values.location}
              onChange={handleInputChange}
              error={errors.location}
              autoComplete="off"
            />
            <Controls.Input
              id="description"
              type="string"
              label="Description"
              name="description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
              autoComplete="off"
            />
            <Controls.Input
              id="voucher"
              type="string"
              label="Voucher"
              name="voucher"
              value={values.voucher}
              onChange={handleInputChange}
              error={errors.voucher}
            />

            <Controls.Button
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
            </div>

            {/* <Controls.Input
              id="rating"
              type="string"
              label="Rating"
              name="rating"
              value={values.rating}
              onChange={handleInputChange}
              error={errors.rating}
            /> */}


            <div style={{textAlign: 'center'}}>
              <Controls.Button type="submit" text="Submit" />
            </div>
          </Grid>
        </Grid>
      </Form>
      
    </>
  );
}

export default CreateStore
