import React, { Component } from 'react'
import { Navigate, Route, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'; 
export const isAuthenticated = () => {
    const authToken = Cookies.get('authToken'); 
    return !!authToken; 
}
export const ReqAuth = ({children,req=true})=>{
    // if req, redirect to login, if not, redirect to home 
    const auth = isAuthenticated(); 
    const location = useLocation();
    if(req){
        if(!auth)return <Navigate to={"/accounts/login"} state={{from:location}}></Navigate>
        return children;
    }else{
        if(auth)return <Navigate to={"/"} state={{from:location}}></Navigate>
        return children;
    }
    
}