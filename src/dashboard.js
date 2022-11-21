import React from 'react'
import './proj.css'
import rowz from './row'
import { useState, useEffect } from 'react'
import api from './seats'

export default function Dashboard() {
    var [ arr, setArr ] = useState( [] )
    var [ tab, setTab ] = useState( [] )
    var [ selectedxd, setSelectedxd ] = useState( [] );
    //api get seats
    const getSeats = async () => {
        const respon = await api.get( '/seats' );
        return respon.data;
    };
    const getReservations = async () => {
        const respon = await api.get( '/reservations' );
        return respon.data;
    };
    const getAllSeats = async () => {
        const allSeats = await getSeats();
        if ( allSeats ) setArr( allSeats );
    };
    const getAllReservations = async () => {
        const allResvs = await getReservations();
        if ( allResvs ) setTab( allResvs );
    };
    useEffect( () => {
        const getAllSeats = async () => {
            const allSeats = await getSeats();
            if ( allSeats ) setArr( allSeats );
        };
        const getAllReservations = async () => {
            const allResvs = await getReservations();
            if ( allResvs ) setTab( allResvs );
        };
        getAllSeats(); getAllReservations();
    }, [] );
    const RELOAD = () => {
        return new Promise( () => {
            setTimeout( () => {
                window.location.reload();
            }, 500 );
        } )
    };

    //api diagram buttons functions
    const yellower = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "yellow"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };

    const greener = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "green"
        } );
        await api.put( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };

    const reder = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "red"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };


    //api table functions confirm/delete seats
    const confirmSeatsTable = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "red"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats();
    };
    const deleteSeatsTable = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "green"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        await api.put( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats();
    };
    const deleteUserTable = async ( x, y ) => {
        console.log( y );
        await api.delete( `/reservations/${ y }` );
        deleteSeatsTable( x );
        getAllReservations();
    };
    //frontend
    var [ selectedxd, setSelectedxd ] = useState( [] );
    function cellColor( color ) {
        switch ( color ) {
            case 'green':
                return '#1aff1a';
            case 'yellow':
                return 'yellow';
            case 'red':
                return 'red';
            default:
                return '';
        }
    };
    // copy values into table
    async function onCheck( e, xd, item ) {
        if ( e.target.checked ) {
            e.target.checked = true;
            setSelectedxd( [ ...selectedxd, xd ] );
        } else {
            e.target.checked = false;
            setSelectedxd( selectedxd.filter( ( currItem ) => currItem !== xd ) );
        }
    };
    return ( <div className='bgr'>
        <table style={ { width: "100%", textAlign: "center" } }><tbody>
            <tr>
                <td colSpan="101"><div className="screen">STAGE</div></td>
            </tr></tbody></table>
        <div className="seatStructure">
            <table id="seatsBlock">
                <tbody>
                    <tr className='seatVGap' ></tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        {
                            rowz.slice( 0, 24 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            rowz.slice( 24, 48 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>A</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 0, 24 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 24, 48 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>B</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 48, 72 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 72, 96 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>C</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 96, 120 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 120, 144 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>D</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 144, 168 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: '#65cee9' } }>Platinum</p>
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        {
                            arr.slice( 168, 192 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>E</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 192, 216 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 216, 240 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>F</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 240, 264 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 264, 288 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>G</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 288, 312 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 312, 336 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>H</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 336, 360 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 360, 384 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>I</td>
                        <td></td>
                        <td></td>

                        {
                            arr.slice( 384, 408 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 408, 432 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr className='seatVGap' ><td colSpan={ 56 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }></p></td></tr>

                    <tr>
                        <td></td>
                        {
                            rowz.slice( 0, 26 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            rowz.slice( 26, 52 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                    </tr>

                    <tr>
                        <td>A</td>
                        {
                            arr.slice( 432, 458 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 458, 484 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>B</td>
                        {
                            arr.slice( 484, 510 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 510, 536 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>C</td>
                        {
                            arr.slice( 536, 562 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 562, 588 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>D</td>
                        {
                            arr.slice( 588, 614 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 614, 640 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>E</td>
                        {
                            arr.slice( 640, 666 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 666, 692 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>F</td>
                        {
                            arr.slice( 692, 718 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 718, 744 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>G</td>
                        {
                            arr.slice( 744, 770 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 770, 796 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>H</td>
                        {
                            arr.slice( 796, 822 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'red' } }>VIP</p>
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        {
                            arr.slice( 822, 848 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>I</td>
                        {
                            arr.slice( 848, 874 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 874, 900 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>J</td>
                        {
                            arr.slice( 900, 926 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 926, 952 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>K</td>
                        {
                            arr.slice( 952, 978 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 978, 1004 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>L</td>
                        {
                            arr.slice( 1004, 1030 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1030, 1056 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>M</td>
                        {
                            arr.slice( 1056, 1082 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1082, 1108 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>N</td>
                        {
                            arr.slice( 1108, 1134 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1134, 1160 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>O</td>
                        {
                            arr.slice( 1160, 1186 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1186, 1212 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>P</td>
                        {
                            arr.slice( 1212, 1238 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1238, 1264 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>

                    <tr className='seatVGap' ><td colSpan={ 56 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }></p></td></tr>

                    <tr>
                        <td></td>
                        {
                            rowz.slice( 0, 26 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            rowz.slice( 26, 52 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>A</td>
                        {
                            arr.slice( 1264, 1290 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1290, 1316 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>B</td>
                        {
                            arr.slice( 1316, 1342 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1342, 1368 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>C</td>
                        {
                            arr.slice( 1368, 1394 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1394, 1420 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>D</td>
                        {
                            arr.slice( 1420, 1446 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1446, 1472 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>E</td>
                        {
                            arr.slice( 1472, 1498 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1498, 1524 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>F</td>
                        {
                            arr.slice( 1524, 1550 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1550, 1576 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>G</td>
                        {
                            arr.slice( 1576, 1602 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'yellow' } }>Gold</p>
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        {
                            arr.slice( 1602, 1628 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>H</td>
                        {
                            arr.slice( 1628, 1654 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1654, 1680 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>I</td>
                        {
                            arr.slice( 1680, 1706 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1706, 1732 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>J</td>
                        {
                            arr.slice( 1732, 1758 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1758, 1784 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>K</td>
                        {
                            arr.slice( 1784, 1810 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1810, 1836 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>L</td>
                        {
                            arr.slice( 1836, 1862 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1862, 1888 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>M</td>
                        {
                            arr.slice( 1888, 1914 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1914, 1940 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>N</td>
                        {
                            arr.slice( 1940, 1966 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 1966, 1992 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>O</td>
                        {
                            arr.slice( 1992, 2018 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2018, 2044 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>P</td>
                        {
                            arr.slice( 2044, 2070 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2070, 2096 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>Q</td>
                        {
                            arr.slice( 2096, 2122 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2122, 2148 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>R</td>
                        {
                            arr.slice( 2148, 2174 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2174, 2200 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>S</td>
                        {
                            arr.slice( 2200, 2226 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2226, 2252 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>T</td>
                        {
                            arr.slice( 2252, 2278 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2278, 2304 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr className='seatVGap' ><td colSpan={ 56 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }></p></td></tr>

                    <tr>
                        <td></td>
                        {
                            rowz.slice( 0, 26 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            rowz.slice( 26, 52 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.value }>{ chair.value }</td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>A</td>
                        {
                            arr.slice( 2304, 2330 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2330, 2356 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>B</td>
                        {
                            arr.slice( 2356, 2382 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2382, 2408 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>C</td>
                        {
                            arr.slice( 2408, 2434 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2434, 2460 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>D</td>
                        {
                            arr.slice( 2460, 2486 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'rgb(165, 165, 165)' } }>Silver</p>
                        <td className="seatGap" colSpan={ 1 }>................</td>
                        {
                            arr.slice( 2486, 2512 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>E</td>
                        {
                            arr.slice( 2512, 2538 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2538, 2564 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>F</td>
                        {
                            arr.slice( 2564, 2590 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2590, 2616 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>G</td>
                        {
                            arr.slice( 2616, 2642 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2642, 2668 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>H</td>
                        {
                            arr.slice( 2668, 2694 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2694, 2720 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>I</td>
                        {
                            arr.slice( 2720, 2746 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2746, 2772 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                    <tr>
                        <td>J</td>
                        {
                            arr.slice( 2772, 2798 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                        <td className="seatGap" colSpan={ 3 }>................</td>
                        {
                            arr.slice( 2798, 2824 ).map( ( chair ) => {
                                return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                            }
                            )
                        }
                    </tr>
                </tbody>
            </table>

        </div>
        <center><button onClick={ () => yellower( selectedxd ) }>Hold (make  yellow)</button>
            <button onClick={ () => greener( selectedxd ) }>Cancel (make green)</button>
            <button onClick={ () => reder( selectedxd ) }>Confirm (make red)</button></center>
        <div className='displayerBoxes'>
            <table className='Displaytabledb'>
                <tbody>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Phone Number1</th>
                        <th>Phone Number2</th>
                        <th>Address</th>
                        <th>Number of Seats Picked</th>
                        <th>Serial Numbers of Seats</th>
                        <th>Number of Platinum tickets</th>
                        <th>Number of VIP tickets</th>
                        <th>Number of Gold tickets</th>
                        <th>Number of Regular tickets</th>
                        <th>Total Price</th>
                        <th>Options</th>
                    </tr>
                    {
                        tab.map( ( user, index ) => {
                            return <tr user={ user } key={ user.phoneNum1 } >
                                <td>{ index + 1 }</td>
                                <td>{ user.userName }</td>
                                <td>{ user.phoneNum1 }</td>
                                <td>{ user.phoneNum2 }</td>
                                <td>{ user.address }</td>
                                <td>{ user.numSeats }</td>
                                <td>{ user.chairxds.toString() }</td>
                                <td>{ user.chairxds.filter( x => x.charAt( 0 ) == "P" ).length }</td>
                                <td>{ user.chairxds.filter( x => x.charAt( 0 ) == "V" ).length }</td>
                                <td>{ user.chairxds.filter( x => x.charAt( 0 ) == "G" ).length }</td>
                                <td>{ user.chairxds.filter( x => x.charAt( 0 ) == "S" ).length }</td>
                                <td>{ user.chairxds.filter( x => x.charAt( 0 ) == "P" ).length * 2500 + user.chairxds.filter( x => x.charAt( 0 ) == "V" ).length * 1500 + user.chairxds.filter( x => x.charAt( 0 ) == "G" ).length * 700 + user.chairxds.filter( x => x.charAt( 0 ) == "R" ).length * 500 }</td>
                                <td><button onClick={ () => confirmSeatsTable( user.chairxds ) }><p>Confirm chairs</p></button><button onClick={ () => deleteSeatsTable( user.chairxds ) }><p>delete chairs</p></button><br />
                                    <button onClick={ () => deleteUserTable( user.chairxds, index ) }><p>delete user</p></button></td>
                            </tr>
                        }

                        )
                    }
                </tbody>

            </table></div>
            

    </div> )
}
