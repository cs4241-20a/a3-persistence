// Add some Javascript code here, to run on the front end.
// This file contains the following methods for interacting with the server:
// submit() - submit a new listing
// deleteListing() - delete a specific listing by listing ID
// getListings() - load listings from the server to the website
// updateListing() - update a specific listing by listing ID

console.log("Welcome to assignment 3!")

const login = function( e ) {

  e.preventDefault()

  // document represents current HTML document
  const username = document.querySelector( '#username' ),
        password = document.querySelector( '#password' ),
        json = { username: username.value,
        password: password.value }
        body = JSON.stringify( json ) 

    //  window.location = "https://github.com/login/oauth/authorize?client_id=5ee171204184dfc4065d" 
    console.log( body )
  fetch( '/login', {
    method:'POST',
    body,
    headers:{
      "Content-Type":"application/json"
          }
  })

  .then( response => response.json() )
  .then( login => {
    console.log( login)
    if( login.login === "good"){
      window.location = "/index"
    }else{
      alert( "You are wrong." )
      console.log( "No." )
    }

  })

  // .then( listings => {
  //   // console.log( listings )
  //   // console.log( Object.keys(listings).length )
  //   displayListings( listings )

  // })

  return false
}

const logout = function( e ) {

  e.preventDefault()
  fetch( '/logout' )
  .then( response => window.location = "/")

  // .then( listings => {
  //   // console.log( listings )
  //   // console.log( Object.keys(listings).length )
  //   displayListings( listings )

  // })

  return false
}

const submit = function( e ) {
    // prevent default form action from being carried out
    // requires 3 parts
    // set action to blank 
    // preventDefault() called
    // function must return false

    e.preventDefault()

    // document represents current HTML document
    const cameraMake = document.querySelector( '#cameramake' ),
          cameraModel = document.querySelector( '#cameramodel' ),
          cameraFormat = document.querySelector( '#cameraformat' ),
          price = document.querySelector( '#price' ),
          condition = document.querySelector( '#condition' )
          json = {
            cameramake: cameraMake.value,
            cameramodel: cameraModel.value, 
            cameraformat: cameraFormat.value,
            price: price.value,
            condition: condition.value,
            delete: false,
            bargain: false,
            id: null}
          body = JSON.stringify( json ) // passed to fetch

    // Fetch is type of JS 'promise'
    // type of asynchronous function - prevents blocking main thread
    // important for JS as it usually is single-threaded
      console.log( body )
    fetch( '/submit', {
      method:'POST',
      body,// this variable has the same name as the property, so the : is omitted - same as writing body: body
      headers:{
        "Content-Type":"application/json"
            }
    })
    // .then( function( response ) {     // fetch this document and *then* run this callback function on the server response
    //   // do something with the reponse 
    //   console.log( response )
    // })
    .then( response => response.json() )
    .then( listings => {
      // console.log( listings )
      // console.log( Object.keys(listings).length )
      displayListings( listings )

    })

    return false
  }

  const deleteListing = function( e ) {
    e.preventDefault()

    const id = document.querySelector( '#deletelistingnumber')

          json = {
            id: id.value,
            delete: true },
          body = JSON.stringify( json ) 

    fetch( '/delete', {
      method:'POST',
      body,
      headers:{
        "Content-Type":"application/json"
            } 
    })
    .then( response => response.json() )
    .then( listings => {
      // console.log( listings )
      // console.log( Object.keys(listings).length )
      displayListings( listings )

    })


    return false
  }

  // fetch( "/add", {
  //   method:'POST',
  //   body:JSON.stringify( { test:1 } ),
  //   headers:{
  //     "Content-Type":"application/json"
  //   }
  // } )
  const getListings = function( e ) {

    e.preventDefault()

    fetch( 'listings', {
        method:'GET'
    })
    .then( response => response.json() )
    .then( listings => {
      // console.log( listings )
      // console.log( Object.keys(listings).length )
      displayListings( listings )

    })


    // .then( listings => {


    // } )


    return false
  }

  const updateListing = function( e ) {

    e.preventDefault()

    // document represents current HTML document
    const cameraMake = document.querySelector( '#updatecameramake' ),
          cameraModel = document.querySelector( '#updatecameramodel' ),
          cameraFormat = document.querySelector( '#updatecameraformat' ),
          price = document.querySelector( '#updateprice' ),
          condition = document.querySelector( '#updatecondition' ),
          id = document.querySelector( '#listingnumber')
          json = {
            cameramake: cameraMake.value,
            cameramodel: cameraModel.value, 
            cameraformat: cameraFormat.value,
            price: price.value,
            condition: condition.value,
            delete: false,
            bargain: false,
            id: id.value},
          body = JSON.stringify( json ) // passed to fetch
    console.log( body )
    fetch( '/update', {
      method:'POST',
      body ,
      headers:{
        "Content-Type":"application/json"
            }
    })
    .then( response => response.json() )
    .then( listings => {
      // console.log( listings )
      // console.log( Object.keys(listings).length )
      displayListings( listings )

    })
    // .then( setTimeout(() => { getListings( e );}, 500 ) )

    return false
  }

  const displayListings = function( incomingData ) {
    if( Object.keys( incomingData ).length === 0 ){
      console.log( "There are no existing listings")
      return false
    }
            // let's create a dynamic table
    const numlistings = Object.keys( incomingData ).length;
    console.log( numlistings )

        var dataTable = document.createElement( "TABLE" );
        dataTable.border = "10";
 
        // Calculate number of columns for this table
        const columnCount = Object.keys( incomingData[0] ).length;
        console.log( "Number of headers per entry: " + columnCount )
        // row for header - iterate through first element's keys to pull types
        var row = dataTable.insertRow( -1 );
        for ( var key in incomingData[0] ) {
          if( key === "delete" || key === "_id" || key === "lister" ){
            continue
          }
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = key;
            row.appendChild( headerCell );
        }
 
        // Iterate through listings
        for (var i = 0; i < numlistings; i++) {
            row = dataTable.insertRow( -1 );
            for ( var key in incomingData[i] ) {
              if( key === "delete" || key === "_id" || key === "lister" ){
                continue
              }
                var cell = row.insertCell( -1 );
                cell.innerHTML = incomingData[i][key];
            }
        }
 
        var dvTable = document.getElementById( "dvTable" );
        dvTable.innerHTML = "";
        dvTable.appendChild( dataTable );
        console.log( "updated data displayed")
  }

  // testing
//   fetch( '/submit', {
//     method:"POST",
//     body:JSON.stringify( { firstname: "No", lastname: "Boggle", cameramake: "Canon", cameramodel: "AE-1P", cameraformat: "35mm", price: 50, condition: 85, bargain: false, delete: false, id:4 }),
//     headers:{
// "Content-Type":"application/json"
//     }
//   })
