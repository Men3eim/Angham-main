const express = require( 'express' );
const port = process.env.PORT || 3005;
const mongoose = require( 'mongoose' );
const cors = require( 'cors' );
const app = express();
const dotenv = require( 'dotenv' ).config();
app.use( express.json() );
app.use( cors() );
app.use( express.urlencoded( { extended: true } ) );
app.use( '/', require( './routes/seatRoute' ) );
app.use( '/', require( './routes/resvRoute' ) );
app.use( '/', require( './routes/xdRoute' ) );

const db = mongoose.connect( "mongodb+srv://moamen:121212m@cluster0.v3bxl6b.mongodb.net/angham?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function ( err ) {
    if ( !err ) { console.log( 'connected' ) }
    else { console.log( err ) };
} ); 
if ( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use( express.static('build' ) );
    app.get('*', ( req, res ) => {
        res.sendFile( path.join( __dirname + 'build/index.html' ) );
    } );
}

app.listen( port, console.log( "ok" ) );
app.get( "/", ( req, res ) => {
res.send 
} )
