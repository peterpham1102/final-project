import { FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core';

import React from 'react'

export default function Select(props) {

    const { name, label, value,error=null, onChange, options, children, ...other } = props;

    return (
        <FormControl variant="outlined"
        {...(error && {error:true})}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                {...other}>
                
                {
                    // options.map(
                    //     item => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)
                    // )
                    children
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
