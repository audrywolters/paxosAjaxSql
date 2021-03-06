$( document ).ready( onReady );

let birds = [];
let editId = null;
// CREATE
function addBird(){
    // get user input and place into an object
    const birdToSend = {
        first_name: $( '#first_nameIn' ).val(),
        last_name: $( '#last_nameIn' ).val(),
        dob: $( '#dobIn' ).val(),
        height: $( '#heightIn' ).val(),
    }
    console.log( 'sending:', birdToSend );
    // send the data to the server via POST
    $.ajax({
        type: 'POST',
        url: '/birds',
        data: birdToSend
    }).then( function( response ){
        console.log( 'back from POST:', response );
        getBirds();
    }).catch( function( err ){
        console.log( err );
        alert( 'no workly' );
    }) // end AJAX
}
// DELETE
function deleteBird(){
    console.log( 'in deleteBird:', $( this ).data( 'id' ) );
    // send this to server via a delete request
    $.ajax({
        type: "DELETE",
        url: '/birds/' + $( this ).data( 'id' )
    }).then( function( response ){
        console.log( 'back from delete with:', response );
        getBirds();
    }).catch( function( err ){
        console.log( err );
        alert( 'problem!' );
    })
}
// sets user interface for UPDATE
function editBird(){
    console.log( 'in editBird:', $( this ).data( 'index' ) );
    const editBird = birds[ $( this ).data( 'index' ) ];
    console.log( 'the bird u want is:',editBird  );
    $( '#firstNameEditIn' ).val( editBird.first_name );
    editId = editBird.id;
}
// READ
function getBirds(){
    $.ajax({
        type: 'GET',
        url: '/birds'
    }).then( function( response ){
        console.log( 'back from GET:', response );
        let el = $( '#birdsOut' );
        el.empty();
        birds = response;
        for( let i=0; i< response.length; i++ ){
            // in our button we are using "data-id" to hold the id of each bird
            el.append( `<li>
                <button class="deleteBirdButton" data-id=${ response[i].id }>Delete</button>
                ${ response[i].first_name }
                ${ response[i].last_name }: 
                born ${ response[i].dob.split( "T" )[0] }, 
                ${ response[i].height } tall
                <button class="editBirdButton" data-index=${ i }>Edit</button>
            </li>`)
        }
    }).catch( function( err ){
        console.log( err );
        alert( 'nope' );
    }) //end AJAX
}

function onReady(){
    // set up
    getBirds();
    // click handlers for elements already on screen at load
    $( '#addBirdButton' ).on( 'click', addBird );
    $( '#saveBirdButton' ).on( 'click', saveBird );
    // since each deleteBirdButton is dynamically created, we will check their parent for click events
    $( '#birdsOut' ).on( 'click', '.deleteBirdButton', deleteBird );
    $( '#birdsOut' ).on( 'click', '.editBirdButton', editBird );  
}
// executes UPDATE
function saveBird(){
    console.log( 'in saveBird' );
    // get user input and place in an object to send
    const dataToSend = {
        new_first_name: $( '#firstNameEditIn').val()
    }
    // send put req to server
    // include id & data we want to change
    $.ajax({
        type: 'PUT',
        url: '/birds/' + editId,
        data: dataToSend
    }).then( function( response ){
        console.log( 'back from PUT with:', response );
        getBirds();
    }).catch( function( err ){
        console.log( err );
        alert( 'nope...' );
    })
}