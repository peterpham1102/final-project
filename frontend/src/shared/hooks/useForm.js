import React, { useEffect, useState } from 'react'

import { makeStyles } from "@material-ui/core";

export function useForm(initialValues, validateOnChange = false, validate) {
    

    const [values, setValues] = useState(initialValues);
    // const [image, setImage] = useState()
    const [errors, setErrors] = useState({});

    // console.log("initialValues ", initialValues)
    useEffect(() => {
        setValues(initialValues)
    },[initialValues])
    
    // console.log("values ", values)

    const handleInputChange = e => {
        // console.log("initialValues ", initialValues)
        // console.log("values handle: ")
        const { name, value } = e.target
        setValues({
            ...values,
            // ...initialValues,
            [name]: value
        })
        if (validateOnChange)
            validate({ [name]: value })
    }
    // console.log(values)


    const resetForm = () => {
        setValues(initialValues);
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
        // handleImageChange

    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form className={classes.root} autoComplete="off" {...other}>
            {children}
        </form>
    )
}

