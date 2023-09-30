import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';

export const EmailConfirm = () => {
    const nav = useNavigate();
    const loc = useLocation(); 
    const [err,setErr] = useState(null);  
    const [success,setSuccess] = useState(false); 
    // const [params,setParams] = useSearchParams(); 
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const data = new FormData(e.target); 
        
        try{
            const response = await api.post(ENDPOINTS.ACCOUNTS.EMAIL_VERIFY,data); 
            console.log("Email verification response:",response); 
            // nav("/");
            setSuccess(true);
            setErr(null); 
        }catch(error){
            const response = error.response; 
            console.log(response); 
            setSuccess(false); 
            setErr("Failed to verify email. Check if key is correct or your email address is already verified."); 
        }
        
    }
    const queryParams = new URLSearchParams(loc.search);
    const key = queryParams.get('key'); 
    console.log("Key:",key);
    return (
        <div className="w-100 p-2 mx-auto" style={{height:"90vh", 
        }}>
            <div className='h-100 d-flex justify-content-center align-items-center'
            >
            {/* <img className='position-absolute'></img> */}
            <Card className='h-auto d-flex justify-content-center align-items-center'>
                <form
                onSubmit={handleSubmit}
                className="d-flex w-100 flex-column  p-5 gap-3"
            >
                    <Card.Header>Verify your email</Card.Header>
                    <Form.Text>Click this button to verify your email address!</Form.Text>
                    <input name="key" type='hidden' value={key}/>
                    <Form.Text className='text-danger px-1 my-0' >{err}</Form.Text>
                    <Button variant='primary' className='rounded-5' type="submit">
                     Confirm
                    </Button>
                    {
                        success && <>
                        
                        <Button variant='primary' href='/accounts/login/' className='rounded-5' >
                        Login
                       </Button>
                       <Form.Text className='text-success px-1 my-0' >Successfully verified email address!</Form.Text>
                       </>
                    }
                </form>
            </Card>
            </div>
        </div>
    )
}