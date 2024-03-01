const mongoose = require( 'mongoose' );
const House = require( '../models/House' );

function deepEqual ( obj1, obj2 ) {
    // If both are not objects or arrays, compare them directly
    if ( typeof obj1 !== 'object' || typeof obj2 !== 'object' || Array.isArray( obj1 ) !== Array.isArray( obj2 ) ) {
        return obj1 === obj2;
    }

    // Get the keys of the two objects
    const keys1 = Object.keys( obj1 );
    const keys2 = Object.keys( obj2 );

    // If number of keys is different, objects are not equal
    if ( keys1.length !== keys2.length ) {
        return false;
    }

    // Check if all keys and their values are equal
    for ( const key of keys1 ) {
        if ( !deepEqual( obj1[ key ], obj2[ key ] ) ) {
            return false;
        }
    }

    return true;
}

const connectMongoDB = async () => {
    try {
        await mongoose.connect( 'mongodb://localhost:27017/house_db', { useNewUrlParser: true, useUnifiedTopology: true } );
        console.log( 'Connected to MongoDB.' );

        // Fetch data from the external API
        const request = await fetch( 'https://wizard-world-api.herokuapp.com/houses' );
        const externalData = await request.json();

        // Check if data has already been fetched
        const existingData = await House.find( {} );

        // Convert existing data to plain JavaScript objects and exclude _id
        const existingDataWithoutId = existingData.map( doc => {
            const dataWithoutId = { ...doc.toObject( { getters: true, virtuals: true } ) };
            delete dataWithoutId._id;
            delete dataWithoutId.__v;

            // Remove _id from nested objects in heads array
            dataWithoutId.heads = dataWithoutId.heads.map( head => {
                const { _id, ...headWithoutId } = head;
                return headWithoutId;
            } );

            // Remove _id from nested objects in traits array
            dataWithoutId.traits = dataWithoutId.traits.map( trait => {
                const { _id, ...traitWithoutId } = trait;
                return traitWithoutId;
            } );

            return dataWithoutId;
        } );

        const isEqual = deepEqual( externalData, existingDataWithoutId );

        if ( !isEqual ) {
            // Map external data to match your House schema
            const houses = externalData.map( item => ( {
                id: item.id,
                name: item.name,
                houseColours: item.houseColours,
                founder: item.founder,
                animal: item.animal,
                element: item.element,
                ghost: item.ghost,
                commonRoom: item.commonRoom,
                heads: item.heads,
                traits: item.traits
            } ) );

            // Update the database with the fetched data
            await House.deleteMany( {} ); // Remove existing data
            await House.insertMany( houses ); // Insert new data
            console.log( 'Database updated with new data.' );
        } else {
            console.log( 'Data from the external API is the same as in the database.' );
        }
    } catch ( error ) {
        console.error( 'Error fetching or updating data:', error );
    }
};

module.exports = connectMongoDB;
