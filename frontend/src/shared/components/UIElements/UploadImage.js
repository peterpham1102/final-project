import React from 'react'

// import {  } from '@material-ui/core';

export default function UploadImage(props) {

    const {type, name, label, value, onChange, ...other } = props;
    return (
        <input
            type={type}
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            
            {...other}
        />
    )
}
