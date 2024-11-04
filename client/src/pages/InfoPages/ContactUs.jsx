import './InfoPages.css';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../utils/AuthContext';
import '../Settings/SettingsLeft/SettingsLeft.css';

const ContactUs = () => {
    const { isAuthenticated } = useAuth();

    const buttonClass = isAuthenticated ? 'auth-button' : 'auth-button non-auth-button';
    const additionalClass = !isAuthenticated ? ' non-auth-fields-input' : '';
    const hrClass = isAuthenticated ? '' : 'non-auth-hr';

    return (
        <section className='infoSections'>
            <div className='infoHeader'>
                <h2>Contact Us</h2>
                <hr className={hrClass} />
            </div>
            <h2>Have questions or need help? We're here for you!</h2>
            <p>
                Whether you're curious about a tarot reading, need assistance, or ran into a hiccup, feel free to reach
                out. We're here to guide you on your tarot journey and ensure a smooth experience with our app.
            </p>
            <div className='form-section'>
                <div className='field-container'>
                    <label
                        htmlFor='contactName'
                        className='label-style'>
                        Name:
                    </label>
                    <input
                        type='text'
                        id='contactName'
                        className={`fields-input input-field${additionalClass}`}
                    />
                </div>
                <div className='field-container'>
                    <label
                        htmlFor='contactEmail'
                        className='label-style'>
                        Email:
                    </label>
                    <input
                        type='email'
                        id='contactEmail'
                        className={`fields-input input-field${additionalClass}`}
                    />
                </div>
                <div className='field-container message'>
                    <label
                        htmlFor='contactMessage'
                        className='label-style'>
                        Message:
                    </label>
                    <textarea
                        id='contactMessage'
                        className={`fields-input input-field textarea-field${additionalClass}`}
                    />
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button className={buttonClass}>Send Message</Button>
            </div>
        </section>
    );
};

export default ContactUs;
