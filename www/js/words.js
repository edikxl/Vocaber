window.onload = () => {

  window.ID = 'words';

  window.addEventListener( 'message', receiveMessage, false );

  function receiveMessage( e ){

    let msg = e.data;

    // Process data

  }

  window.parent.postMessage( { type: 'system', requester: window.ID, command: 'get', db: 'words', number: '10', sortBy: 'date' }, '*' );

}