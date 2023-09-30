import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate } from 'react-router-dom';

import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';
import Cookies from 'js-cookie';
import { useGlobalContext } from 'context';
export const Logout = () => {
    const nav = useNavigate(); 
    const {setCurrentUser} = useGlobalContext(); 
    if(!Cookies.get('authToken'))nav('/accounts/login');
    else{
        console.log("Auth Token exists:",Cookies.get('authToken')); 
    }      
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const data = new FormData(e.target); 
        const response = await api.post(ENDPOINTS.ACCOUNTS.LOGOUT,data); 
        console.log("Logout response:",response); 
        // const key = response.data.key; 
        // api.defaults.headers.common['Authorization']=`Token ${key}`; 
        Cookies.remove('authToken'); 
        setCurrentUser(null);
        nav("/");
    }
    return (
        <div className="w-100 p-2 mx-auto" style={{height:"90vh", 
        }}>
            <div className='h-100 d-flex justify-content-center align-items-center'
            >
            {/* <img className='position-absolute'></img> */}
            <Card className='h-auto d-flex justify-content-center align-items-center '>
                <form
                // action={ENDPOINTS.ACCOUNTS.LOGOUT}
                className="d-flex mw-100 mh-100 flex-column p-5 gap-3"
                encType="multipart/form-data"
                id="post-form"
                method="post"
                onSubmit={handleSubmit}
            >
                    <Card.Header>Logout</Card.Header>
                    <Form.Text>Are you sure you want to sign out?</Form.Text>
                    <Button variant='secondary' className='rounded-5' type="submit">
                    Sign out  
                    </Button>
                </form>
            </Card>
            </div>
        </div>
    )
}