const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs } = require('./schemas');
const { resolvers } = require('./schemas/resolvers');
const { singleDB } = require('./config/connection'); // Updated to use a single DB connection
const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('SINGLE_DB_URI:', process.env.SINGLE_DB_URI); // Log the single DB URI

const PORT = process.env.PORT || 3001;
const app = express();

// Configure AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Initialize the S3 client
const s3 = new AWS.S3();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/dist as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

const startApolloServer = async () => {
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: authMiddleware
        });

        await server.start();
        server.applyMiddleware({ app });

        // Wait for the single database to be connected before starting the server
        singleDB.once('open', () => {
            app.listen(PORT, () => {
                console.log(`API server running on port ${PORT}!`);
                console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
            });
        });

        singleDB.on('error', (err) => {
            console.error('Error connecting to database:', err);
        });
    } catch (error) {
        console.error('Error starting Apollo Server:', error);
    }
};

startApolloServer();
