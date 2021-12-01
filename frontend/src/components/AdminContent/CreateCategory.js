import { Form, useForm } from "../../shared/hooks/useForm";
import { Grid, MenuItem, makeStyles } from "@material-ui/core";
import { React, useEffect, useState, useRef } from "react";

import Controls from "../../shared/components/UIElements/Controls";
import api from "../../shared/util/api";

import { useHistory } from "react-router";

// import storage from "../firebase";

// const useStyles = makeStyles((theme) => ({}));

const initialValues = {
  id: "",
  name: "",
  description: ""

};

function CreateCategory(props) {
  const history = useHistory();
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("decription" in fieldValues) 
      temp.decription = fieldValues.decription ? "" : "This field is required.";
    
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(url)
    if (validate()) {
      const res = await api({
        url: "categories",
        method: "POST",
        data: values
      });
      try {
        if (res.success) {
          console.log("Create category successfully!");
          history.push("/");
          resetForm();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };




  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  return (
    <>
      <h1>Create Category</h1>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <Controls.Input
              id="name"
              type="string"
              name="name"
              label="Category Name"
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

            />

            <div style={{textAlign: 'center'}}>
              <Controls.Button type="submit" text="Submit" />
            </div>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}

export default CreateCategory;
