const express = require( "express" );
const connectMongoDB = require( "./db/house_db" );
const House = require( './models/House' );
const app = express();
const cors = require( "cors" );
const port = 8080;

// Init DB Connection And Data
connectMongoDB();

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

// CORS
app.use( cors( corsOptions ) );


// Route to get houses by name
app.get( '/houses', async ( req, res ) => {
    const { name } = req.query;
    if ( name ) {
        try {
            const filteredHouses = await House.find( { name: { $regex: new RegExp( name, 'i' ) } } );
            res.json( filteredHouses );
        } catch ( error ) {
            res.status( 500 ).json( { error: 'Internal server error' } );
        }
    } else {
        const houses = await House.find( {} );
        res.json( houses );
    }
} );


app.listen( port, () => {
    console.log( `Server is running on port ${ port }` );
} );