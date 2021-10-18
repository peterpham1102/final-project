import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const {type, name, label, value,error=null, onChange, defaultValue, ...other } = props;
    return (
        <TextField
            type={type}
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            {...(error && {error:true,helperText:error})}
            {...other}
        />
    )
}
