import React from 'react'
import './proj.css'
import rowz from './row'
import { useState, useEffect } from 'react'
import api from './seats'
import JsPDF from 'jspdf'
export default function ProjX() {
    //api get seats
    var [ arr, setArr ] = useState( [] );
    const getSeats = async () => {
        const respon = await api.get( '/seats' );
        return respon.data;
    };
    const getAllSeats = async () => {
        const allSeats = await getSeats();
        if ( allSeats ) setArr( allSeats );
    };
    useEffect( () => {
        const getAllSeats = async () => {
            const allSeats = await getSeats();
            if ( allSeats ) setArr( allSeats );
        };
        getAllSeats()
    }, [] );
    const RELOAD = () => {
        return new Promise( () => {
            setTimeout( () => {
                window.location.reload();
            }, 500 );
        } )
    };
    const throwInvoice = () => {
        setInvoice( false );
    }
    function invoicer( i ) {
        switch ( i ) {
            case true:
                return 'none';
            case false:
                return 'block';
            default:
                return '';
        }
    }


    //api update/request seats
    const xdUpdater = async () => {
        setPlease( "Please Wait, Checking the seats" );
        var res = ( await api.post( `/resvd/`, {
            chairxds: selectedxd
        } ) ).data;
        if ( res.check == false ) {
            alert( 'SOME OR ALL SEATS YOU HAVE SELECTED HAD JUST BEEN TAKEN BY ANOTHER USER, THE PAGE WILL RELOAD NOW ' );
            RELOAD();
        };
        if ( res.check == true ) { seatsUpdater(); };
    }

    const seatsUpdater = async () => {
        await api.put( `/seats/${ selectedxd }`, {
            chairxds: selectedxd,
            color: "yellow"
        } );
        throwInvoice();
        tableUpdater();
        await api.post( `/resvd/${ selectedxd }`, {
            chairxds: selectedxd
        } );
    };

    const final = () => {
        RELOAD();
    };

    const tableUpdater = async () => {
        await api.post( `/reservations/`, {
            "userName": userName,
            "numSeats": numSeats,
            "chairxds": selectedxd,
            "phoneNum1": phoneNumber1,
            "phoneNum2": phoneNumber2,
            "address": address
        }
        );
    };


    //functions of frontend
    var [ userName, setUserName ] = useState()
    var [ email, setEmail ] = useState()
    var [ address, setAddress ] = useState()
    var [ numSeats, setNumSeats ] = useState()
    var [ phoneNumber1, setPhoneNumber1 ] = useState()
    var [ phoneNumber2, setPhoneNumber2 ] = useState()
    var [ notification, setNotification ] = useState()
    var [ confirm, setConfirm ] = useState( true )
    var [ invoice, setInvoice ] = useState( true )
    var [ selected, setSelected ] = useState( [] );
    var [ selectedxd, setSelectedxd ] = useState( [] );
    var [ please, setPlease ] = useState( "" );
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
    const handleChangeName = ( event ) => {
        var namevalue = event.target.value;
        setUserName( namevalue );
    };
    const handleChangeNum = ( event ) => {
        var numvalue = event.target.value;
        setNumSeats( numvalue );
    };
    const handleChangeEmail = ( event ) => {
        var numvalue = event.target.value;
        setEmail( numvalue );
    };
    const handleChangeAddress = ( event ) => {
        var numvalue = event.target.value;
        setAddress( numvalue );
    };
    const handleChangePhone1 = ( event ) => {
        var phonevalue = event.target.value;
        setPhoneNumber1( phonevalue );
    };
    const handleChangePhone2 = ( event ) => {
        var phonevalue = event.target.value;
        setPhoneNumber2( phonevalue );
    };
    //first button
    function form() {
        if ( numSeats > 0 ) {
            setNotification( <p>Please Select The Seats Now And Submit <br /><br /> Scroll In All Directions To See All Chairs</p> )
            setConfirm( false )
        }
        else {
        alert("Please choose A valid number of seats")
        }
    }

    function taker() {
        if ( userName == null || numSeats == null || phoneNumber1 == null || phoneNumber2 == null || email == null || address == null || phoneNumber1==phoneNumber2) {
            alert( "PLEASE FILL ALL FIELDS IN THE FORM ABOVE" );
        }
        else {
            form();
        }
    };
    // copy values into table
    function onCheck( e, xd, item ) {
        if ( userName == null || numSeats == null || phoneNumber1 == null || phoneNumber2 == null || email == null || address == null || notification == null ) {
            alert( "PLEASE FILL ALL FIELDS IN THE FORM ABOVE" );
            e.target.checked = false;
        }
        if ( e.target.checked && selectedxd.length == numSeats ) {
            alert( `You Have Already Chosen All ${ numSeats } Seats` )
            e.target.checked = false;
        }
        if ( e.target.checked ) {
            e.target.checked = true;
            setSelectedxd( [ ...selectedxd, xd ] );
            setSelected( [ ...selected, item ] );
        }
        else {
            e.target.checked = false;
            setSelected( selected.filter( ( currItem ) => currItem !== item ) );
            setSelectedxd( selectedxd.filter( ( currItem ) => currItem !== xd ) );
        }
    };
    const requestTicket = () => {
        if ( selectedxd.length == numSeats ) {
            xdUpdater();
        }
        else {
            alert( `please choose ${ numSeats } chair` );
            setConfirm( false );
        }
    };

    const downloadInvoiceTable = () => {
        const report = new JsPDF( 'portrait', 'pt', 'a3' );
        report.html( document.querySelector( '#ivt' ) ).then( () => {
            report.save( 'invoice.pdf' );
        } );
    }
    var zoom = 1;
    function zIn() {
        zoom += 0.1;
        document.querySelector( '.target' ).style.transform = `scale(  ${ zoom } )`;
    };
    function rst() {
        zoom = 1;
        document.querySelector( '.target' ).style.transform = `scale(  ${ zoom } )`;
    };
    function zOut() {
        zoom -= 0.1;
        document.querySelector( '.target' ).style.transform = `scale(  ${ zoom } )`;
    };
    return (
        <div className='bgr'>
            <div className="inputForm">
                <div className='inputForm1'>
                    <ul>
                        <li><p>برجاء التأكد من صحة رقم الهاتف والعنوان لأن تأكيد الحجز يتم من خلالهما</p>
                        </li>
                        <li>
                            <p>حجز الكراسي يتم مرة واحدة فقط ولا يمكن تعديله </p>
                        </li>
                        <li><p>واذا لم يتواجد رقم هاتف صحيح يتم الغاء الحجز تلقائيا من قبل خدمة العملاء</p></li>
                        <li>
                            <p>Please Make Sure The Phone Number And Address Are Correct Because Confirmation And Delivery of The Tickets Are Done Using Them</p>
                        </li>
                        <li>
                            <p>take into consideration that registeration is only done ONCE and cannot be changed </p>
                        </li>
                        <li><p>if the phone number isn't valid the registeration is cancelled</p></li>
                        <li>Prices:
                            <ul>
                                <li>Platinum : 2500L.E</li>
                                <li>VIP : 1500L.E</li>
                                <li>Gold : 700L.E</li>
                                <li>Silver : 500L.E</li>
                            </ul></li>
                    </ul>
                </div>
                <div className='inputForm2'><br />
                    <div><label>Name:</label><input type="text" onChange={ handleChangeName } required disabled={ !confirm } /></div><br />
                    <div><label>E-mail:</label><input type="text" onChange={ handleChangeEmail } required disabled={ !confirm } /></div><br />
                    <div><label>Address:</label><input type="text" onChange={ handleChangeAddress } required disabled={ !confirm } /></div><br />
                    <div><label>Number of Seats:</label><input type="number" onChange={ handleChangeNum } id="Numseats" required disabled={ !confirm } /></div><br />
                    <div><label>Correct Phone Number1:</label ><input type="number" onChange={ handleChangePhone1 } id="Numseats" required disabled={ !confirm } /></div ><br />
                    <div><label>Correct Phone Number2:</label ><input type="number" onChange={ handleChangePhone2 } id="Numseats" required disabled={ !confirm } /></div ><br />
                </div>
            </div>
            <div className='notification'>
                <button onClick={ () => taker() } style={ { margin: "auto" } } className=' slctbtn ' >Start Selecting</button>
                { notification }</div>
            <center >
                <table style={ { width: "100%", textAlign: "center" } }><tbody>
                    <tr>
                        <td colSpan="101"><div className="screen">STAGE</div></td>
                    </tr></tbody></table>
                <table style={ { textAlign: "center" } }><tbody><tr>
                    <td colSpan={ 5 }><div className="mapped1" style={ { pointerEvents: "none", backgroundColor: "green" } }><img src='/fill.png' alt="" /></div><br />Available</td>
                    <td style={ { visibility: "hidden" } }>....</td>
                    <td colSpan={ 5 }><div className="mapped1" style={ { pointerEvents: "none", backgroundColor: "yellow" } }><img src='/fill.png' alt="" /></div><br />On Hold</td>
                    <td style={ { visibility: "hidden" } }>....</td>
                    <td colSpan={ 5 }><div className="mapped1" style={ { pointerEvents: "none", backgroundColor: "red" } }><img src='/fill.png' alt="" /></div><br />Booked</td>
                </tr></tbody></table>
                <a className="btn zoom" onClick={ () => zIn() }><i className="fas fa-search-plus"></i></a>
                <a className="btn zoom-out" onClick={ () => zOut() }><i className="fas fa-search-minus"></i></a>
                <a className="btn zoom-init" onClick={ () => rst() }><i className="fas fa-recycle"></i></a>
            </center>
            <div className="seatStructure">
                <table id="seatsBlock" className='target'>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 24, 48 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 72, 96 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 120, 144 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: '#65cee9' } }>Platinum</p>
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            {
                                arr.slice( 168, 192 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 216, 240 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 264, 288 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 312, 336 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 360, 384 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 408, 432 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 458, 484 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>B</td>
                            {
                                arr.slice( 484, 510 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 510, 536 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>C</td>
                            {
                                arr.slice( 536, 562 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 562, 588 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>D</td>
                            {
                                arr.slice( 588, 614 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 614, 640 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>E</td>
                            {
                                arr.slice( 640, 666 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 666, 692 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>F</td>
                            {
                                arr.slice( 692, 718 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 718, 744 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>G</td>
                            {
                                arr.slice( 744, 770 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 770, 796 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>H</td>
                            {
                                arr.slice( 796, 822 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'darkblue' } }>VIP</p>
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            {
                                arr.slice( 822, 848 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>I</td>
                            {
                                arr.slice( 848, 874 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 874, 900 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>J</td>
                            {
                                arr.slice( 900, 926 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 926, 952 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>K</td>
                            {
                                arr.slice( 952, 978 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 978, 1004 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>L</td>
                            {
                                arr.slice( 1004, 1030 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1030, 1056 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>M</td>
                            {
                                arr.slice( 1056, 1082 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1082, 1108 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>N</td>
                            {
                                arr.slice( 1108, 1134 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1134, 1160 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>O</td>
                            {
                                arr.slice( 1160, 1186 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1186, 1212 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>P</td>
                            {
                                arr.slice( 1212, 1238 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1238, 1264 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1290, 1316 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>B</td>
                            {
                                arr.slice( 1316, 1342 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1342, 1368 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>C</td>
                            {
                                arr.slice( 1368, 1394 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1394, 1420 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>D</td>
                            {
                                arr.slice( 1420, 1446 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1446, 1472 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>E</td>
                            {
                                arr.slice( 1472, 1498 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1498, 1524 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>F</td>
                            {
                                arr.slice( 1524, 1550 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1550, 1576 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>G</td>
                            {
                                arr.slice( 1576, 1602 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'yellow' } }>Gold</p>
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            {
                                arr.slice( 1602, 1628 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>H</td>
                            {
                                arr.slice( 1628, 1654 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1654, 1680 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>I</td>
                            {
                                arr.slice( 1680, 1706 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1706, 1732 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>J</td>
                            {
                                arr.slice( 1732, 1758 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1758, 1784 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>K</td>
                            {
                                arr.slice( 1784, 1810 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1810, 1836 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>L</td>
                            {
                                arr.slice( 1836, 1862 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1862, 1888 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>M</td>
                            {
                                arr.slice( 1888, 1914 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1914, 1940 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>N</td>
                            {
                                arr.slice( 1940, 1966 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 1966, 1992 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>O</td>
                            {
                                arr.slice( 1992, 2018 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2018, 2044 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>P</td>
                            {
                                arr.slice( 2044, 2070 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2070, 2096 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>Q</td>
                            {
                                arr.slice( 2096, 2122 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2122, 2148 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>R</td>
                            {
                                arr.slice( 2148, 2174 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2174, 2200 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>S</td>
                            {
                                arr.slice( 2200, 2226 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2226, 2252 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>T</td>
                            {
                                arr.slice( 2252, 2278 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2278, 2304 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
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
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2330, 2356 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>B</td>
                            {
                                arr.slice( 2356, 2382 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2382, 2408 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>C</td>
                            {
                                arr.slice( 2408, 2434 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2434, 2460 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>D</td>
                            {
                                arr.slice( 2460, 2486 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            <p className="seatCGap" style={ { fontFamily: 'Times New Roman', color: 'rgb(165, 165, 165)' } }>Silver</p>
                            <td className="seatGap" colSpan={ 1 }>................</td>
                            {
                                arr.slice( 2486, 2512 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>E</td>
                            {
                                arr.slice( 2512, 2538 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2538, 2564 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>F</td>
                            {
                                arr.slice( 2564, 2590 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2590, 2616 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>G</td>
                            {
                                arr.slice( 2616, 2642 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2642, 2668 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>H</td>
                            {
                                arr.slice( 2668, 2694 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2694, 2720 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>I</td>
                            {
                                arr.slice( 2720, 2746 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2746, 2772 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>J</td>
                            {
                                arr.slice( 2772, 2798 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                            <td className="seatGap" colSpan={ 3 }>................</td>
                            {
                                arr.slice( 2798, 2824 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className="seats" value={ chair.xd } id={ chair.xd } /><div className="mapped" style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><img src='/fill.png' alt="" /></label></div></td>
                                }
                                )
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="displayerBoxes">
                <button id="confirm" className='slctbtn' disabled={ confirm } onClick={ () => requestTicket() }>Confirm Selection</button>
                <p id="please">{ please }</p>
                <table className="Displaytable">
                    <tbody>
                        <tr><td className='hdr'>Name</td></tr>
                        <tr><td className='dt'>{ userName }</td></tr>
                        <tr><td className='hdr'>Serial Numbers of Seats</td></tr>
                        <tr><td className='dt'>{ selectedxd.toString() }</td></tr>
                        <tr><td className='hdr'>Phone Number1</td></tr>
                        <tr><td className='dt'>{ phoneNumber1 }</td></tr>
                        <tr><td className='hdr'>Phone Number2</td></tr>
                        <tr><td className='dt'>{ phoneNumber2 }</td></tr>
                        <tr><td className='hdr'>Email</td></tr>
                        <tr><td className='dt'>{ email }</td></tr>
                        <tr><td className='hdr'>Address</td></tr>
                        <tr><td className='dt'>{ address }</td></tr>
                        <tr><td className='hdr'>Number of Platinum tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "P" ).length }</td></tr>
                        <tr><td className='hdr'>Number of VIP tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "V" ).length }</td></tr>
                        <tr><td className='hdr'>Number of Gold tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "G" ).length }</td></tr>
                        <tr><td className='hdr'>Number of Regular tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "S" ).length }</td></tr>
                        <tr><td className='hdr'>Total number of tickets</td></tr>
                        <tr><td className='dt'>{ numSeats }</td></tr>
                        <tr><td className='hdr'>Total Price</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "P" ).length * 2500 + selectedxd.filter( x => x.charAt( 0 ) == "V" ).length * 1500 + selectedxd.filter( x => x.charAt( 0 ) == "G" ).length * 700 + selectedxd.filter( x => x.charAt( 0 ) == "S" ).length * 500 }</td></tr>
                    </tbody>
                </table>
            </div>
            <footer className='ftr'>
                <p>Developed by: <br /><ul>
                    <li>Ahmed Mohamed Abdelmeneim</li>
                    <li>Moamen Wady</li>
                </ul></p>
                <p>Contact Us:<br />
                -whatsapp: +201022369011 <br/>
                    <a href="https://www.facebook.com/profile.php?id=100003353902387" target='_blank'>-Facebook</a>
                    
                </p>
            </footer>
            <div className='invoice' style={ { display: invoicer( invoice ), zIndex: 2000000 } }>
                <p style={ { color: 'black' } }><br />
                    تم تسجيل الحجز بنجاح ✅<br /><br />
                    <b>pdfبرجاء تنزيل نسخة ال <br /> Doneقبل الضغط على زر </b><br />
                    تم تسجيل حجزك و سيتم التواصل معك خلال يومين من قبل خدمه العملاء لتسليم التذاكر<br />
                    رقمك المسجل يجب ان يكون صحيحا ليتواصل المندوب معك<br /><br />
                    الغاء الحجز يتم عن طريق خدمه العملاء قبل الاستلام<br />
                    يتم الدفع كاش او فيزا عند الاستلام في العنوان المتفق عليه مع المندوب<br />
                    غير مسئولين عن اي تذاكر تباع خارج الموقع او منافذ البيع المعلن عنها<br />
                    انت دائما مميز معنا و نتمني لك حفلة سعيده ♥️<br /><br /></p>
                <hr />
                <table className="Displaytable" id="ivt">
                    <tbody>
                        <tr><td className='hdr'>Name</td></tr>
                        <tr><td className='dt'>{ userName }</td></tr>
                        <tr><td className='hdr'>Serial Numbers of Seats</td></tr>
                        <tr><td className='dt'>{ selectedxd.toString() }</td></tr>
                        <tr><td className='hdr'>Phone Number1</td></tr>
                        <tr><td className='dt'>{ phoneNumber1 }</td></tr>
                        <tr><td className='hdr'>Phone Number2</td></tr>
                        <tr><td className='dt'>{ phoneNumber2 }</td></tr>
                        <tr><td className='hdr'>Email</td></tr>
                        <tr><td className='dt'>{ email }</td></tr>
                        <tr><td className='hdr'>Address</td></tr>
                        <tr><td className='dt'>{ address }</td></tr>
                        <tr><td className='hdr'>Number of Platinum tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "P" ).length }</td></tr>
                        <tr><td className='hdr'>Number of VIP tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "V" ).length }</td></tr>
                        <tr><td className='hdr'>Number of Gold tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "G" ).length }</td></tr>
                        <tr><td className='hdr'>Number of Regular tickets</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "S" ).length }</td></tr>
                        <tr><td className='hdr'>Total number of tickets</td></tr>
                        <tr><td className='dt'>{ numSeats }</td></tr>
                        <tr><td className='hdr'>Total Price</td></tr>
                        <tr><td className='dt'>{ selectedxd.filter( x => x.charAt( 0 ) == "P" ).length * 2500 + selectedxd.filter( x => x.charAt( 0 ) == "V" ).length * 1500 + selectedxd.filter( x => x.charAt( 0 ) == "G" ).length * 700 + selectedxd.filter( x => x.charAt( 0 ) == "S" ).length * 500 }</td></tr>
                    </tbody>
                </table>
                <button onClick={ () => downloadInvoiceTable() }>Download PDF</button>
                <hr />
                <p style={ { color: 'black' } }>
                    <br />
                    <br />
                    Your reservation has been completed and our customer service agents will be contacting you within the next 2 days, Kindly make sure the phone number you have provided is correct in order to contact you to receive your tickets.
                    <br />
                    <br />
                    For cancellations kindly contact our customer service before receiving the tickets.
                    You can pay in cash or visa upon receiving at the address and time you and the courier agrees on.
                    <br />
                    <br />
                    We are not responsible for any tickets sold outside the site or the advertised outlets You are always special with us and we wish you a happy party ♥️
                </p> <button onClick={ () => final() }>Done</button></div>
        </div> )
}
