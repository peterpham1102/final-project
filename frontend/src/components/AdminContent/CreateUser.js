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
  email: "",
  password: "",
  phone: "",
  role: "",
  image: "",
};

function CreateUser(props) {
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
    event.preventDefault();
    console.log(url)
    const res = await api({
      url: "users/signup",
      method: "POST",
      data: {
        ...values,
        image: url,
      },
    });
    try {
      if (res.success) {
        console.log("Create account successfully!");
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
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("password" in fieldValues)
      temp.password =
        fieldValues.password.length > 5 ? "" : "Minimum 6 numbers required.";
    // if ("confirmPassword" in fieldValues)
    //   temp.confirmPassword = fieldValues.password ? "" : "Confirm password must match the password"
    if ("role" in fieldValues)
      temp.role = fieldValues.role.length != 0 ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };


  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  return (
    <>
      <h1>Create User</h1>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Full Name"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />

            <Controls.Input
              id="email"
              type="string"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
              autoComplete="off"
            />
            <Controls.Input
              id="password"
              type="password"
              label="Password"
              name="password"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
              autoComplete="off"
            />
            <Controls.Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
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

            {/* <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
              />
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label> */}

            <div>
              <img src={url} width="300px" height="300px" />
            </div>

            <Controls.Input
              id="phone"
              type="string"
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />

            <Controls.Select
              name="role"
              label="Role"
              value={values.role}
              onChange={handleInputChange}
              error={errors.role}
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="shipper">Shipper</MenuItem>
            </Controls.Select>

            <div>
              <Controls.Button type="submit" text="Submit" />
            </div>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}

export default CreateUser;
