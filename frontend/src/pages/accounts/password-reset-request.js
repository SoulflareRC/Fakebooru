import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate } from 'react-router-dom';

import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';

export const PasswordResetRequest = () => {
    const nav = useNavigate();
    const [err,setErr] = useState(null);  
    const [msg,setMsg] = useState(null); 
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const data = new FormData(e.target); 
        const endpoint = ENDPOINTS.ACCOUNTS.PASSWORD_RESET; 
        try{
            const response = await api.post(endpoint,data);
            console.log("Password reset response:",response);
            // nav("/accounts/email-sent");   
        }catch(error){
            console.log(error.response);
            // let msgs = []; 
            // const err_data = error.response.data;
            // console.log(typeof(err_data));  
            // for(const key in err_data){
            //     msgs.push(err_data[key]); 
            // }
            // // console.log(msgs); 
            // setErr(msgs); 
        }
    }
    return (
        <div className="w-100 p-2 mx-auto" style={{height:"90vh", 
        }}>
            <div className='h-100 d-flex justify-content-center align-items-center'
            >
            {/* <img className='position-absolute'></img> */}
            <Card className='h-auto d-flex justify-content-center align-items-center'>
                <form
                action=""
                className="d-flex w-100 flex-column  p-5 gap-3"
                encType="multipart/form-data"
                id="post-form"
                method="post"
                onSubmit={handleSubmit}
            >
                    <Card.Header>Reset password</Card.Header>
                    <Form.Text className='text-danger px-1 my-0' >{err}</Form.Text>
                    <Form.Control id="email" required name="email" placeholder="Email Address" type="email" />
                    <Form.Text className='text-danger px-1 my-0' >{err}</Form.Text>
                    <Button variant='primary' className='rounded-5' type="submit">
                     Submit
                    </Button>
                    
                </form>
            </Card>
            </div>
        </div>
    )
}