import './InfoPages.css';

const FAQs = () => {
    return (
        <section className='infoSections'>
            <div className='infoHeader'>
                <h2>Frequently Asked Questions</h2>
                <hr className='hr-spread' />
            </div>
            <h2 className='mt-5'>Why this App?</h2>
            <p>
                Our journey began from a simple realization: Despite the wealth of tarot resources online, we couldn't
                find a mobile app that truly catered to our needs. Existing websites offered comprehensive information,
                but we craved the convenience of an all-in-one, on-the-go solution.
            </p>

            <p>
                We wanted a digital tool that could house multiple decks, provide insightful spread information, and
                offer on-demand readings without the need to lug around a heavy bag of decks and books. This app is our
                answer to that need—a portable tarot companion for both novices and experienced users alike, empowering
                you to explore the depths of tarot wherever you go.
            </p>
        </section>
    );
};

export default FAQs;
