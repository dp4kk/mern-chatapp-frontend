import React, { useContext } from 'react'
import {Redirect, Route} from 'react-router-dom'
import {AppContext} from '../contexts/DataContext'
const PrivateRoute = ({component:Component,...rest}) => {
    const {user}=useContext(AppContext)
    return (
       <Route {...rest} render={(props)=>{return (!user.accessToken)?(<Redirect to='/login'/>):(<Component {...props}/>) }}/>
    )
}

export default PrivateRoute
