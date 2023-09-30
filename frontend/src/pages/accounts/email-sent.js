import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate } from 'react-router-dom';

import api from '../../api';
import * as Tags from 'components/tags';
import { ENDPOINTS } from 'endpoints';

export const EmailSent = () => {
    const nav = useNavigate();
    const [err,setErr] = useState("error");  
    return (
        <div className="w-100 p-2 mx-auto" style={{height:"90vh", 
        }}>
            <div className='h-100 d-flex justify-content-center align-items-center'
            >
            {/* <img className='position-absolute'></img> */}
            <Card className='h-auto d-flex justify-content-center align-items-center'>
                <div
                className="d-flex w-100 flex-column  p-5 gap-3"
            >
                    <Card.Header>Verify your email</Card.Header>
                    <Form.Text>We've sent an email to your email address to verify your email address.</Form.Text>
                    <Button variant='primary' href='/accounts/login' className='rounded-5' type="submit">
                     Confirm
                    </Button>
                    
                </div>
            </Card>
            </div>
        </div>
    )
}