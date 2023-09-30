import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate } from 'react-router-dom';

import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';
// import Cookies from "cookie";
import Cookies from 'js-cookie';
import { useGlobalContext } from 'context';
export const Login = () => {
    const nav = useNavigate(); 
    const {currentUser,fetchCurrentUserData} = useGlobalContext(); 
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const data = new FormData(e.target); 
        const response = await api.post(ENDPOINTS.ACCOUNTS.LOGIN,data); 
        console.log("Login response:",response); 
        const key = response.data.key; 
        api.defaults.headers.common['Authorization']=`Token ${key}`; 
        Cookies.set('authToken',key);
        const userData = await fetchCurrentUserData(); 
        console.log("Current user data after login:", userData);
        if(userData&&!userData.verified){
            
            // console.log("Verified?",currentUser.verified); 
            Cookies.remove('authToken'); 
            nav('/accounts/email-sent'); 
        }
        else nav("/");
    }
    return (
        <div className="w-100 p-2 mx-auto" style={{height:"90vh", 
        }}>
            <div className='h-100 d-flex justify-content-center align-items-center'
            >
            {/* <img className='position-absolute'></img> */}
            <Card className='h-auto d-flex justify-content-center align-items-center '>
                <form
                action={ENDPOINTS.ACCOUNTS.LOGIN}
                className="d-flex mw-100 mh-100 flex-column p-5 gap-3"
                encType="multipart/form-data"
                id="post-form"
                method="post"
                onSubmit={handleSubmit}
            >
                    <Card.Header>Login</Card.Header>
                    <Form.Control id="email" name="email" required placeholder="Email Address" type="email" />
                    <Form.Control id="password" required name="password" placeholder="Password" type="password" />
                    <Button className='rounded-5' type="submit">
                    Login 
                    </Button>
                    <Button variant='secondary' href='/accounts/register' className='rounded-5'>
                    Sign up  
                    </Button>
                    <Button variant='warning' href='/accounts/password-reset-request/' className='rounded-5'>
                        Reset Password  
                    </Button>
                </form>
            </Card>
            </div>
        </div>
    )
}