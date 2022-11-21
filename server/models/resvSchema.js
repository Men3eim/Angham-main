const mongoose = require( 'mongoose' )


const resvSchema = new mongoose.Schema( {
    userName: String,
    address: String,
    numSeats: Number,
    chairxds: Array,
    phoneNum1:Number,
    phoneNum2: Number
} )

const Resv = mongoose.model( 'Resv', resvSchema )

module.exports = Resv;