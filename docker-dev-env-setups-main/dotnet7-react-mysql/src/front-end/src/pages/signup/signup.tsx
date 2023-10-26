import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { errorToast } from '../../components/toasts/toasts';
import { AuthApi } from '../../api/authApi';
import { IResult } from '../../api/interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (email === "") {
            errorToast("Email is required", true);
            return;
        }
        if (password === "") {
            errorToast("Password is required", true);
            return;
        }

        let result: IResult = await AuthApi.register({ email: email, password: password });
        if (result.statusCode !== 201) {
            errorToast(result.message, true);
            return;
        }

        navigate('/login');
    };

    return (
        <Container className='d-flex justify-content-center align-items-center login-container p-4'>
            <div className='w-50'>
                <h1 className='text-center py-4'>Sign Up</h1>
                <hr />
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='formBasicEmail' className='px-4'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='formBasicPassword' className='px-4'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </Form.Group>

                    <Button variant='primary' type='submit' className='w-100 my-4 mx-x'>
                        Submit
                    </Button>
                </Form>
            </div>
        </Container>
    );
}