import { useState, useEffect, useContext, useCallback } from 'react';
import CustomSwitch from '../Switch';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    reformatBirthday,
    formatBirthday,
    formatPhoneNumber,
    formatBirthdayToISO,
    checkEmail,
    checkDiscordHandle
} from '../FormatedFunctions/FormatedFunctions';
import { GET_ME } from '../../../utils/queries';
import { EDIT_USER_SETTINGS } from '../../../utils/mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import '../Settings.css';
import '../ThemeConfig';

const UserInformation = () => {
    const handleToggle = (value) => {
        console.log(value);
        setFormData((prev) => ({ ...prev, [value]: !formData[value] }));
    };

    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        phoneNumber: '',
        discordHandle: '',
        displayDiscordHandle: false,
        displayBirthday: false
    });
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        phoneNumber: '',
        discordHandle: '',
        birthdayError: '',
        emailError: '',
        discordHandleError: '',
        displayDiscordHandle: false,
        displayBirthday: false
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);

    const [updateUserSettings] = useMutation(EDIT_USER_SETTINGS);
    const [getMe, { data: currentUserData }] = useLazyQuery(GET_ME);

    useEffect(() => {
        getMe();
    }, [getMe]); // Empty dependency array to run once on component mount
    useEffect(() => {
        if (currentUserData && currentUserData.me) {
            const birthday = reformatBirthday(currentUserData.me.birthday);
            setUserData((prevUserData) => ({
                ...prevUserData,
                username: currentUserData.me.username,
                firstName: currentUserData.me.firstName,
                lastName: currentUserData.me.lastName,
                phoneNumber: currentUserData.me.phoneNumber,
                birthday: birthday,
                email: currentUserData.me.email,
                discordHandle: currentUserData.me.discordHandle,
                displayDiscordHandle: currentUserData.me.displayDiscordHandle,
                displayBirthday: currentUserData.me.displayBirthday
            }));
            setFormData((prevUserData) => ({
                ...prevUserData,
                username: currentUserData.me.username,
                firstName: currentUserData.me.firstName,
                lastName: currentUserData.me.lastName,
                phoneNumber: currentUserData.me.phoneNumber,
                birthday: birthday,
                email: currentUserData.me.email,
                discordHandle: currentUserData.me.discordHandle,
                displayDiscordHandle: currentUserData.me.displayDiscordHandle,
                displayBirthday: currentUserData.me.displayBirthday
            }));
        }
    }, [currentUserData]);

    const toggleDisabled = () => {
        setIsEditing(!isEditing);
        setShowSubmitButton(!isEditing);
        if (isEditing) {
            setFormData(userData);
        } else {
            setFormData(userData);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        console.log(event.name, event.value);

        let formattedPhoneNumber, formattedBirthday, birthData, isValid;
        let currentError = '';

        switch (name) {
            case 'username':
                setFormData((prevUserData) => ({
                    ...prevUserData,
                    username: value
                }));
                break;
            case 'firstName':
                setFormData((prevUserData) => ({
                    ...prevUserData,
                    firstName: value
                }));
                break;
            case 'lastName':
                setFormData((prevUserData) => ({
                    ...prevUserData,
                    lastName: value
                }));
                break;
            case 'birthday':
                // Format birthday input with '/' for display
                birthData = formatBirthday(value);
                formattedBirthday = birthData.formattedBirthday;
                currentError = birthData.error;
                setFormData((prevUserData) => ({
                    ...prevUserData,
                    birthday: formattedBirthday,
                    birthdayError: currentError
                }));
                if (!currentError) {
                    setFormData((prevUserData) => ({
                        ...prevUserData,
                        birthdayError: currentError
                    }));
                }
                break;
            case 'email':
                isValid = checkEmail(value);
                if (isValid) {
                    setFormData((prevUserData) => ({
                        ...prevUserData,
                        email: value,
                        emailError: ''
                    }));
                } else {
                    setFormData((prevUserData) => ({
                        ...prevUserData,
                        email: value,
                        emailError: 'Please enter a valid email address'
                    }));
                }
                break;
            case 'discordHandle':
                isValid = checkDiscordHandle(value);
                if (isValid) {
                    setFormData((prevUserData) => ({
                        ...prevUserData,
                        discordHandle: value,
                        discordHandleError: ''
                    }));
                } else {
                    setFormData((prevUserData) => ({
                        ...prevUserData,
                        discordHandle: value,
                        discordHandleError: 'Please enter a valid Discord handle'
                    }));
                }
                break;
            case 'phoneNumber':
                // Format phone number input and limit characters
                formattedPhoneNumber = formatPhoneNumber(value);
                setFormData((prevUserData) => ({
                    ...prevUserData,
                    phoneNumber: formattedPhoneNumber
                }));
                break;
            default:
                break;
        }
    };

    const handleDeleteField = (fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: '' // Clears data
        }));
    };

    // Cleans Form Data
    const filteredData = {};
    Object.keys(formData).forEach((key) => {
        // ignore fields with erros
        if (key === 'birthdayError' || key === 'emailError' || key === 'discordHandleError') {
            return;
        }

        // Check if the field value has changed
        if (formData[key] !== userData[key]) {
            if (key === 'birthday') {
                filteredData[key] = formatBirthdayToISO(formData[key]);
            } else if (formData[key] === '') {
                // Convert empty string to null to clear the field in the database
                filteredData[key] = null;
            } else {
                filteredData[key] = formData[key];
            }
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!formData.birthdayError && !formData.emailError) {
                // const formattedBirthday = formatBirthdayToISO(formData.birthday);

                const userId = await currentUserData.me._id;

                const { data } = await updateUserSettings({
                    variables: {
                        userId: userId,
                        input: filteredData
                    }
                });
                console.log(data);
            }
        } catch (err) {
            console.error('Error saving user data:', err);
        }
        setIsEditing(!isEditing);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className='forms'>
                <h2>
                    <div style={{ flex: 1 }}></div>
                    <span style={{ flexShrink: 0 }}>User Information</span>
                    <div
                        className='switches'
                        onClick={toggleDisabled}>
                        <i className='fas fa-pencil-alt'></i>
                    </div>
                </h2>
                <hr />
            </div>

            {/* {isEditing ? (
                <div className='fields'>
                    <label htmlFor='username'>Username:</label>
                    <div className='formFieldsDiv'>
                        <Form.Control
                            id='username'
                            value={formData.username}
                            onChange={handleChange}
                            name='username'
                            className={`editable`} // Add 'editable' class when editing
                        />
                        <div className='trashCanContainer'>
                            <DeleteIcon
                                className='trashCan'
                                onClick={() => handleDeleteField('username')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='fields'>
                    <label htmlFor='username'>Username:</label>
                    <div
                        id='username'
                        className='disabled'>
                        {userData.username}
                    </div>
                </div>
            )} */}

            {!isEditing && (
                <div className='fields'>
                    <label htmlFor='username'>Username:</label>
                    <div
                        id='username'
                        className='disabled'>
                        {userData.username}
                    </div>
                </div>
            )}
            <div className='fields'>
                {isEditing ? (
                    <div className='fields-editing'>
                        <label htmlFor='name'>First Name:</label>
                        <div className='formFieldsDiv'>
                            <Form.Control
                                id='firstName'
                                value={formData.firstName || ''}
                                onChange={handleChange}
                                name='firstName'
                                className={`editable`} // Add 'editable' class when editing
                            />
                            <div className='trashCanContainer'>
                                <DeleteIcon
                                    className='trashCan'
                                    onClick={() => handleDeleteField('firstName')}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='fields-editing'>
                        <label htmlFor='name'>Name:</label>
                        <div id='name'>
                            {userData.firstName} {userData.lastName}
                        </div>
                    </div>
                )}
            </div>
            {isEditing && (
                <div className='fields fields-editing'>
                    <label htmlFor='name'>Last Name:</label>
                    <div className='formFieldsDiv'>
                        <Form.Control
                            id='lastName'
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            name='lastName'
                            className={`editable`} // Add 'editable' class when editing
                        />
                        <div className='trashCanContainer'>
                            <DeleteIcon
                                className='trashCan'
                                onClick={() => handleDeleteField('lastName')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className='fields birthday'>
                    <label
                        className='labels'
                        htmlFor='birthday'>
                        Birthday:
                    </label>
                    <div className='formFieldsDiv'>
                        <Form.Control
                            id='birthday'
                            value={formData.birthday || ''}
                            onChange={handleChange}
                            name='birthday'
                            maxLength='10' // Restricts user to only input correct length of values
                            className={`editable`} // Add 'editable' class when editing
                        />
                        <div className='trashCanContainer'></div>
                    </div>
                </div>
            ) : (
                <div className='fields birthday'>
                    <label
                        className='labels'
                        htmlFor='birthday'>
                        Birthday:
                    </label>
                    <div
                        id='birthday'
                        className='disabled'>
                        {userData.birthday}
                    </div>
                </div>
            )}

            {formData.birthdayError && (
                <div
                    id='birthdayError'
                    className='form-errors'>
                    {formData.birthdayError}
                </div>
            )}
            {isEditing ? (
                <div>
                    <div className='fields-birthday'>
                        <CustomSwitch
                            label='Display Birthday Month and Day:'
                            checked={formData.displayBirthday}
                            onChange={() => {
                                handleToggle('displayBirthday');
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <div className='fields-birthday'>
                        <CustomSwitch
                            label='Display Birthday Month and Day:'
                            checked={userData.displayBirthday}
                            disabled
                        />
                    </div>
                </div>
            )}
            {!isEditing && (
                <div className='fields'>
                    <label
                        htmlFor='email'
                        className='labels'>
                        Email:
                    </label>
                    <div
                        id='email'
                        className='disabled'>
                        {userData.email}
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className='fields discord'>
                    <label
                        htmlFor='discord'
                        className='labels'>
                        Discord Tag:
                    </label>
                    <div className='formFieldsDiv'>
                        <Form.Control
                            id='discordHandle'
                            value={formData.discordHandle || ''}
                            onChange={handleChange}
                            name='discordHandle'
                            className={`editable`} // Add 'editable' class when editing
                        />
                        <div className='trashCanContainer'>
                            <DeleteIcon
                                className='trashCan'
                                onClick={() => handleDeleteField('discordHandle')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='fields discord'>
                    <label
                        htmlFor='discord'
                        className='labels'>
                        Discord Tag:
                    </label>
                    <div
                        id='discord'
                        className='disabled'>
                        {userData.discordHandle}
                    </div>
                </div>
            )}
            {formData.discordHandleError && (
                <div
                    id='discordHandleError'
                    className='form-errors'>
                    {formData.discordHandleError}
                </div>
            )}
            {!isEditing ? (
                <div>
                    <div className='fields-discord'>
                        <CustomSwitch
                            label='Display Discord Tag:'
                            checked={userData.displayDiscordHandle}
                            disabled
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <div className='fields-discord'>
                        <CustomSwitch
                            label='Display Discord Tag:'
                            checked={formData.displayDiscordHandle}
                            onChange={() => handleToggle('displayDiscordHandle')}
                        />
                    </div>
                </div>
            )}
            {isEditing ? (
                <div className='fields'>
                    <label
                        htmlFor='phone'
                        className='labels'>
                        Phone Number:
                    </label>
                    <div className='formFieldsDiv'>
                        <Form.Control
                            id='phoneNumber'
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            name='phoneNumber'
                            className={`editable`} // Add 'editable' class when editing
                        />
                        <div className='trashCanContainer'>
                            <DeleteIcon
                                className='trashCan'
                                onClick={() => handleDeleteField('phoneNumber')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='fields'>
                    <label htmlFor='phone'>Phone Number:</label>
                    <div
                        id='phoneNumber'
                        className='disabled'>
                        {userData.phoneNumber}
                    </div>
                </div>
            )}
            {showSubmitButton && (
                <Button
                    className='button'
                    type='submit'>
                    Submit
                </Button>
            )}
        </Form>
    );
};

export default UserInformation;
