import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { Form, useForm } from "../../shared/hooks/useForm";
import { React, useContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { AuthContext } from "../../App";
import Controls from "../../shared/components/UIElements/Controls";
import { Redirect } from "react-router-dom";
import api from "../../shared/util/api";
import { makeStyles } from "@material-ui/core";
import Notification from "../../shared/components/UIElements/Notification";

// import {LockOutlinedIcon} from "@mui/icons-material";

// const useStyles = makeStyles((theme) => ({
//   form: {
//     marginTop: 8,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
// }));

const initialValues = {
  id: "",
  email: "",
  password: "",
};

const theme = createTheme();

function LoginPage() {
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  // const classes = useStyles();
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("email" in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required.";
    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required.";
    setErrors({
      ...temp,
    });
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  const authValue = useContext(AuthContext);
  const { user, login } = authValue;
  const [loading, setLoading] = useState(false);
  // const [values, setValues] = useState('');
  if (user) {
    const redirectLink = `/${user.role}`;
    return <Redirect to={redirectLink} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (validate()){
    
      const res = await api({
        url: "users/login",
        method: "POST",
        data: values,
      });
      try {
      if (res.success) {
        setLoading(false);
        console.log(res);
        login(res);
        return res;
      } else {
        setNotify({
          isOpen: true,
          message: 'Invalid credentials, please try again!',
          type: 'error'
      })
        setLoading(false);
      }
    } catch (error) {
      

      setLoading(false);

      console.log("error api: ", error);
    }
  }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Form onSubmit={handleSubmit}>
              <Controls.Input
                id="email"
                // required
                type="string"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                autoFocus
                fullWidth
              />
              <Controls.Input
                id="password"
                // required
                type="password"
                name="password"
                label="Password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
                fullWidth
              />
              <div style={{textAlign: 'center'}}>
                <Controls.Button
                  type="submit"
                  text="Login"
                  // fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                />
              </div>
            </Form>
            
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </ThemeProvider>
  );
}

export default LoginPage;
