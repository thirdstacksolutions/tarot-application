import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SIGNUP_USER } from '../../../utils/mutations';
import { CHECK_USERNAME } from '../../../utils/queries';
import { useAuth } from '../../../utils/AuthContext';
import './Modals.css';

const username_pattern = /^[A-Za-z][A-Za-z0-9_]{4,19}$/;
const email_pattern = /.+@.+\..+/;
const password_pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,25}$/;

const SignupForm = () => {
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [signUpUser] = useMutation(SIGNUP_USER);
    const [usernameChecker] = useLazyQuery(CHECK_USERNAME);
    const [error, setError] = useState(null);
    const [unerror, setUnerror] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { login } = useAuth();
    // const [timeout, setTimeout] = useState(null);

    const handleChange = async (event) => {
        const { name, value } = event.target;

        let checkUser = true;
        // let uniqueUser = false;
        let isValid = true;
        switch (name) {
            case 'username':
                isValid = username_pattern.test(value);
                if (isValid) {
                    try {
                        const { data } = await usernameChecker({
                            variables: { username: value }
                        });
                        // lines 44 - 48 do not do anything. If username is available then usernameChecker returns null which is an error and skips everything
                        const usernameCheckerValue = data.usernameChecker.username;
                        // console.log(data.usernameChecker);
                        if (usernameCheckerValue === null) {
                            // console.log('available username');
                            // uniqueUser = true; // Username is unique
                        } else {
                            // console.log('Username already exists');
                            checkUser = false;
                        }
                    } catch (error) {
                        console.error('Error checking username:', error);
                    }
                } else {
                    setError(`Invalid ${name} format`);
                }

                break;
            case 'email':
                isValid = email_pattern.test(value);
                break;
            case 'password':
                isValid = password_pattern.test(value);
                break;
            case 'password-confirmation':
                if (formState.password !== value) {
                    isValid = false;
                }
                break;
            default:
                break;
        }

        if (!isValid) {
            // console.log('Invalid  format');
            setError(`Invalid ${name} format`);
        } else {
            setError(null);
        }

        if (!checkUser) {
            setError('Username already exists');
            setUnerror(null);
        } else if (isValid) {
            setUnerror('Avaliable username');
        } else {
            setUnerror(null);
        }

        setFormState({
            ...formState,
            [name]: value
        });
    };
    // console.log(startTimeout);
    // const startTimeout = () => {
    //     const id = setTimeout(() => {
    //         // Timeout logic
    //         console.log('Timeout Completed!');
    //     }, 5000); // Timeout duration in milliseconds
    // };

    // // Function to clear the timeout
    // const clearTimeout = () => {
    //     clearTimeout(timeout);
    //     setTimeout(null);
    // };

    // if (formState.username.length >= 5 && formState.password.length <= 20) {
    //     console.log('username');
    // }
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const signupFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        try {
            const { data } = await signUpUser({
                variables: { ...formState }
            });

            // Log in the user
            login(data.signup.token); // Use the login function from useAuth
        } catch (e) {
            console.error(e);
        }

        setFormState({
            username: '',
            email: '',
            password: ''
        });
    };

    return (
        <div
            style={{
                width: '325px',
                marginTop: '10px'
            }}>
            <form
                id='signupForm'
                onSubmit={signupFormSubmit || signupFormSubmit}>
                <h1
                    className='text-bold'
                    style={{
                        color: '#A89467',
                        fontFamily: 'Lugrasimo',
                        textShadow: '2px 2px 2px #121212',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                    Sign Up
                </h1>
                <div className='form-group'>
                    <label
                        className='label'
                        htmlFor='username'>
                        Username:
                    </label>
                    <input
                        type='username'
                        id='username'
                        placeholder='Enter Username'
                        value={formState.username}
                        name='username'
                        onChange={handleChange}
                        className='form-control'
                    />
                </div>
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
                        className='form-control'
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
                        className='form-control'
                    />
                </div>
                <div className='form-group'>
                    <label
                        className='label'
                        htmlFor='passwordConfirm'>
                        {' '}
                        Confirm Password:
                    </label>
                    <input
                        type='password'
                        id='passwordConfirm'
                        placeholder='Enter Password'
                        value={formState.passwordConfirm}
                        name='passwordConfirm'
                        onChange={handleChange}
                        className='form-control'
                    />
                </div>
                <div className='form-group form-check '>
                    <input
                        type='checkbox'
                        id='termsCheckbox'
                        className='form-check-input'
                        required
                    />
                    <label
                        htmlFor='termsCheckbox'
                        className='form-check-label'
                        style={{ marginBottom: '5px' }}>
                        I have read and agree to these{' '}
                        <a
                            href='/terms'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='checkbox-link'
                            style={{
                                textDecoration: 'underline',
                                color: '#A89467',
                                textShadow: '1px 1px 1px #121212'
                            }}>
                            Terms
                        </a>
                        .
                    </label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {unerror && <p style={{ color: 'green' }}>{unerror}</p>}
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

export default SignupForm;
