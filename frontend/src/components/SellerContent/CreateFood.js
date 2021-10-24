import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, MenuItem, makeStyles } from "@material-ui/core";
import { React, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";
import storage from "../firebase";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({}));

const initialValues = {
  id: "",
  name: "",
  image: "",
  description: "",
  price: "",
  store_id: ''
};

function CreateFood() {
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState();
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const [storeId, setStoreId] = useState();
  const authValue = useContext(AuthContext);
  const { user } = authValue;

  useEffect(() => {
    console.log("image: ", image);
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
  console.log(image);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: `users/user/${user.userId}`,
          method: "GET",
        });
        setStoreId(res.user.store_owned_id);
        console.log("(res.user.store_owned_id ", res.user.store_owned_id);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [storeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();  
    console.log(url);
    const res = await api({
      url: "foods",
      method: "POST",
      data: {
        ...values,
        image: url,
        store_id: storeId
      },
    });
    try {
      if (res.success) {
        console.log("Create food successfully!");
        history.push("/");
        resetForm();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);
  return (
    <>
      <h1>Create Food</h1>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Food Name"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
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
              id="price"
              type="string"
              label="Price"
              name="price"
              value={values.price}
              onChange={handleInputChange}
              error={errors.price}
              autoComplete="off"
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
              <img
                src={url || "http://via.placeholder.com/300"}
                height="300px"
                width="300px"
                alt="food-image"
              />
            </div>
            

           
            <div>
              <Controls.Button type="submit" text="Submit" />
            </div>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}

export default CreateFood;