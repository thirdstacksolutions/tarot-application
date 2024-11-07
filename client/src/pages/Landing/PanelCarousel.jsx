import { useEffect, useRef, useState } from 'react';
import Splide from '@splidejs/splide';
import PanelOne from './PanelOne';
import PanelTwo from './PanelTwo';
import PanelThree from './PanelThree';
// import AuthComponent from "./Login_Signup/AuthComponent";
import '@splidejs/splide/dist/css/splide.min.css';
import './Landing.css';
import SimpleFooter from '../../components/FooterPane/SimpleFooter';
import { useModal } from './ModalContext';

const PanelCarousel = () => {
    const splideRef = useRef(null);
    const [activePanel, setActivePanel] = useState(0);
    const { handleLoginClose, handleSignUpClose } = useModal();

    useEffect(() => {
        if (splideRef.current) {
            const splide = new Splide(splideRef.current, {
                direction: 'ttb',
                height: '100vh',
                wheel: true,
                pagination: true,
                arrows: false,
                speed: 2000,
                wheelSleep: 1000,
                classes: {
                    pagination: 'splide__pagination splide__pagination--custom'
                }
            });

            splide.on('move', (newIndex) => {
                handleLoginClose(); // Close login modal when panel changes
                handleSignUpClose(); // Close signup modal when panel changes
                setActivePanel(newIndex);
            });

            splide.mount();
        }
    }, []);

    return (
        <div>
            <div
                ref={splideRef}
                className='splide'>
                <div className='splide__track'>
                    <ul className='splide__list'>
                        <li className='splide__slide'>
                            <PanelOne activePanel={activePanel} />
                        </li>
                        <li className='splide__slide'>
                            <PanelTwo activePanel={activePanel} />
                        </li>
                        <li className='splide__slide'>
                            <PanelThree activePanel={activePanel} />
                        </li>
                    </ul>
                </div>
            </div>
            <SimpleFooter />
        </div>
    );
};

export default PanelCarousel;
