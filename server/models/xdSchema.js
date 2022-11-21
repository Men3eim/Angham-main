const mongoose = require( 'mongoose' )
const uniqueValidator = require( 'mongoose-unique-validator' );


const xdSchema = new mongoose.Schema({ 
    Xd : { type: String, required: true }
}
)

const xd = mongoose.model( 'Xd', xdSchema )

module.exports = xd;