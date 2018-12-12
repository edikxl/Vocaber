window.onload = () => {

  let iframe = document.getElementById( 'iframe' );
  let dataToReturn = [];

  window.addEventListener( 'message', receiveMessage, false );

  function receiveMessage( e ){

    document.getElementById( 'debug' ).innerHTML = 'FUCKCCKKYOU';

    let msg = e.data; // { type: '', link: '', data: '' };

    if( msg !== undefined ){ // TODO: Try to understand who send fake messages

      if( typeof( msg ) == 'string' ){ // If msg from React

        msg = JSON.parse( msg );

        //if( msg.type != 'blank' ){ # App.js 25

        OnReact( msg );

        //}

      }else{ // If msg from Web

        OnWeb( msg );

      }

    }

  }

  function OnReact( msg ){

    if( msg.requester == iframe.contentWindow.ID ){

      iframe.contentWindow.postMessage( msg.data, '*' );

    }

  }

  function OnWeb( msg ){

    if( msg.type == 'system' ){ // Message for system( react )

      window.postMessage( msg.data, '*' );

    }else if( msg.type == 'page' ){ // Message for page

      if( msg.direction = 'back' ){

        iframe.src = msg.link;
        iframe.contentWindow.postMessage( [ dataToReturn[-1], msg.data ], '*' ); // [ oldData, newData ]
        dataToReturn.pop();

      }else{

        dataToReturn.push( iframe.contentWindow.data );
        iframe.src = msg.link;

      }

    }

  }

  iframe.src = 'words.html';
  iframe.contentWindow.postMessage( 'DO YOU HEAR ME???', '*' );

}