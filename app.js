const express = require('express')
const bodyparser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

const grapgQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')


const app = express();

app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth)

app.use('/graphql', graphqlHTTP({   
    schema: grapgQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
    
}));

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
        }@cluster0.nylcn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    app.listen(8000);
}).catch(err => {
    console.log(err);
});


