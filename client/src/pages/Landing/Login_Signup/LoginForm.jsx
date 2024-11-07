import { useState } from 'react';
import './Modals.css';
import { useAuth } from '../../../utils/AuthContext';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../../utils/mutations';

const LoginForm = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    });

    const { login } = useAuth();

    const [loginUser] = useMutation(LOGIN_USER);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const loginFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        try {
            const { data } = await loginUser({
                variables: { ...formState }
            });

            login(data.login.token);
        } catch (e) {
            console.error(e);
        }

        setFormState({
            email: '',
            password: ''
        });
    };

    return (
        <div
            style={{
                width: '325px',
                margin: 'auto',
                marginTop: '10px'
            }}>
            <form
                id='loginForm'
                onSubmit={loginFormSubmit}>
                <h1
                    className='text-bold'
                    style={{
                        color: '#A89467',
                        fontFamily: 'Lugrasimo',
                        textShadow: '2px 2px 2px #121212',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                    Login
                </h1>
                <div className='form-group'>
                    <label
                        className='label'
                        htmlFor='email'>
                        Email Address:
                    </label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter Email'
                        value={formState.email}
                        name='email'
                        onChange={handleChange}
                    />
                </div>
                <div className='form-group'>
                    <label
                        className='label'
                        htmlFor='password'>
                        {' '}
                        Password:
                    </label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter Password'
                        value={formState.password}
                        name='password'
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginTop: '5px', marginLeft: '5px' }}>
                    <span>
                        Forget your password? Reset{' '}
                        <a
                            href=''
                            style={{ color: '#A89467', textShadow: '1px 1px 1px #121212' }}>
                            here
                        </a>
                        .
                    </span>
                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                        className='auth-button'
                        style={{ marginTop: '0' }}
                        type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
