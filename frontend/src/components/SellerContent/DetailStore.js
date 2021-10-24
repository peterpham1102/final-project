import Controls from '../../shared/components/UIElements/Controls'
import FoodList from './FoodList'
import React from 'react'
import ShopInfo from './ShopInfo'
import { Typography } from '@material-ui/core'

function DetailStore(props) {
  return (
    <>
    <ShopInfo storeOwnedId={props.storeOwnedId}  />
    
    
    <FoodList storeOwnedId={props.storeOwnedId}/>
    
    </>
  )
}

export default DetailStore
