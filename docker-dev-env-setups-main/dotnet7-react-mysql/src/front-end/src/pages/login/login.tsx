import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/authApi';
import { IApiTokens, IGlobalContext, ILoginResponse, IResult } from '../../api/interfaces/interfaces';
import { errorToast, successToast } from '../../components/toasts/toasts';
import { Connection } from '../../api/connection';

interface IProps {
    context: IGlobalContext
}
export const LoginPage = (props: IProps) => {
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

        let result: IResult = await AuthApi.login({ email: email, password: password });
        if (result.statusCode !== 200) {
            errorToast(result.message, true);
            return;
        }

        successToast("Successfully logged in", true);

        let authData: ILoginResponse = result.data;
        Connection.setConnectionDetail(email, authData.tokens.token, authData.tokens.refreshToken, authData.id, authData.roleId, 1);

        props.context.setIsLoggedIn(true);
        props.context.setRoleId(authData.roleId);
        props.context.setUserId(authData.id);

        navigate('/');
    };

    return (
        <Container className='d-flex justify-content-center align-items-center login-container p-4'>
            <div className='w-50'>
                <h1 className='text-center py-4'>Login</h1>
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