window.onload = () => {

  let iframe = document.getElementById( 'iframe' );
  let dataToReturn = [];

  window.addEventListener( 'message', receiveMessage, false );

  function receiveMessage( e ){

    let msg = e.data; // { type: '', link: '', data: '' };

    if( typeof( msg ) == 'string' ){ // If msg from React

      msg = JSON.parse( msg );

      //if( msg.type != 'blank' ){ # App.js 25

      OnReact( msg );

      //}

    }else{ // If msg from Web

      OnWeb( msg );

    }

  }

  function OnReact( msg ){

    if( msg.requester == iframe.contentWindow.ID ){

      iframe.contentWindow.postMessage( msg.data, '*' );

    }

  }

  function OnWeb( msg ){

    if( msg.type == 'system' ){ // Message for system( react )

      console.log( msg.data );
      // PRODUCTION: window.postMessage( msg.data );

    }else if( msg.type == 'page' ){ // Message for page

      if( msg.direction = 'back' ){

        iframe.src = msg.link;
        iframe.contentWindow.postMessage( [ dataToReturn[-1], msg.data ] ); // [ oldData, newData ]
        dataToReturn.pop();

      }else{

        dataToReturn.push( iframe.contentWindow.data );
        iframe.src = msg.link;

      }

    }

  }

  iframe.src = 'words.html';

}