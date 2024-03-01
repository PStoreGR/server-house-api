const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const headSchema = new Schema( {
    id: String,
    firstName: String,
    lastName: String
} );

const traitSchema = new Schema( {
    id: String,
    name: String
} );

const houseSchema = new Schema( {
    id: String,
    name: String,
    houseColours: String,
    founder: String,
    animal: String,
    element: String,
    ghost: String,
    commonRoom: String,
    heads: [ headSchema ],
    traits: [ traitSchema ]
} );

const House = mongoose.model.House || mongoose.model( 'House', houseSchema );

module.exports = House;
