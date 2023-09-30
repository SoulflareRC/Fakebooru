import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate,useLocation } from 'react-router-dom';

import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';

export const PasswordResetConfirm = () => {
    const nav = useNavigate();
    const loc = useLocation(); 
    const queryParams = new URLSearchParams(loc.search);
    const token = queryParams.get('token');
    const uid = queryParams.get('uid');  
    const [err,setErr] = useState(null);  
    const [msg,setMsg] = useState(null); 
    const [success,setSuccess] = useState(false); 
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const data = new FormData(e.target); 
        try{
            const response = await api.post(ENDPOINTS.ACCOUNTS.PASSWORD_RESET_CONFIRM,data); 
            console.log("Password reset response:",response); 
            
            setSuccess(true);
            setErr(null); 
            nav("/accounts/login/");
        }catch(error){
            console.log(error.response);
            let msgs = []; 
            const err_data = error.response.data;
            console.log(typeof(err_data));  
            for(const key in err_data){
                msgs.push(err_data[key]); 
            }
            // console.log(msgs); 
            setErr(msgs); 
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
                    <Form.Control  required name="new_password1" placeholder="Password" type="password" />
                    <Form.Control  required name="new_password2" placeholder="Retype password" type="password" />
                    <Form.Text className='text-danger px-1 my-0' >{err}</Form.Text>
                    <input name="token" type='hidden' value={token}/>
                    <input name="uid" type='hidden' value={uid}/>
                    <Button variant='primary' className='rounded-5' type="submit">
                     Submit
                    </Button>
                    
                </form>
            </Card>
            </div>
        </div>
    )
}