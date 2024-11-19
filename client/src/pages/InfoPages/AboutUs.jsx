import PropTypes from 'prop-types';
import Empress from '../../assets/03_The_Empress.jpg';
import Moon from '../../assets/18_The_Moon.jpg';
import Magician from '../../assets/01_The_Magician.jpg';
import './InfoPages.css';

const TeamMember = ({ image, name, title, description, reverse }) => (
    <section style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
        {reverse ? (
            <>
                <p style={{ textAlign: 'justify', width: '70%' }}>{description}</p>
                <div style={{ width: '70%', textAlign: 'right', margin: '16px 0' }}>
                    <h3 style={{ margin: 0 }}>{name}</h3>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{title}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', width: '30%' }}>
                    <img
                        src={image}
                        alt={name}
                        style={{ width: '80%', height: 'auto', borderRadius: '50%', border: '6px solid slategrey' }}
                    />
                </div>
            </>
        ) : (
            <>
                <div style={{ display: 'flex', justifyContent: 'left', width: '30%' }}>
                    <img
                        src={image}
                        alt={name}
                        style={{ width: '80%', height: 'auto', borderRadius: '50%', border: '6px solid slategrey' }}
                    />
                </div>
                <div style={{ width: '30%', textAlign: 'left', margin: '16px 0' }}>
                    <h3 style={{ margin: 0 }}>{name}</h3>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{title}</p>
                </div>
                <p style={{ textAlign: 'justify', width: '30%' }}>{description}</p>
            </>
        )}
    </section>
);

const AboutUs = () => {
    return (
        <section
            style={{
                width: '40%',
                margin: 'auto',
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
            }}>
            <h2>Meet the Team</h2>
            <hr style={{ width: '100%', marginBottom: '3rem' }} />
            <TeamMember
                image={Empress}
                name='John Doe'
                title='CEO'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed urna vel nisi mattis aliquet.'
            />
            <TeamMember
                image={Moon}
                name='Jane Smith'
                title='CTO'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed urna vel nisi mattis aliquet.'
                reverse={true}
            />
            <TeamMember
                image={Magician}
                name='Alice Johnson'
                title='Lead Developer'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed urna vel nisi mattis aliquet.'
            />
        </section>
    );
};

export default AboutUs;
