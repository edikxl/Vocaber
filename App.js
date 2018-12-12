import React, { Component } from 'react';
import { WebView, StatusBar, AsyncStorage } from 'react-native';

export default class App extends Component {

  componentDidMount(){

    this.DB.getItem( 'settings' )
      .then( ( settings ) => {

        if( !settings ){ // If there is no any of dbs' config( for example settings' )

          Object.keys( this.DB.CFGs ).forEach( name => this.DB.setCFG( name ) ); // Use blanks to set them

        }else{ // If there are cfgs, load them

          Object.keys( this.DB.CFGs ).forEach( name => this.DB.loadCFG( name ) );

        }

      })

  }

  render(){

    return(

      <WebView
        ref={ webview => { this.webView = webview; } }
        source={ require( './www/index.html' ) }
        style={{ marginTop: StatusBar.currentHeight }}
        onMessage={ this.onWebMessage }
      />

    );

  }

  onWebMessage( e ){

    console.log( e );
    console.log( 'ARE YOU OKEY THERE, HAH???' );

    msg = JSON.parse( e.nativeEvent.data );

    // CHECK: IF WORKS WITHOUT: this.webView.postMessage( JSON.stringify( { type: 'blank' } ) );

    this.system[ msg.command ]( msg )
      .then( ( data ) => {

        this.webView.postMessage( JSON.stringify( {

          requester: msg.ID,
          data: data

        } ) );

      } )

  }

  // System

  system = {

    //CHECK: IF WORKS WITHOUT: DB: this.DB, 

    'get': async ( msg ) => {

      let data = null;

      if( msg.sortBy == "date" ){

        let IDs = this.DB.CFGs[ msg.db ].IDs.slice( -msg.number );

        data = await this.DB.multiGet( IDs );

      }else if( msg.sortBy == 'usage' ){

        // ADD: SORTING BY USAGE

      }

      return data;

    }

  }

  // DataBase methods

  DB = {

    CFGs: {

      'words': {

        valueOfTotalUsage: 0,
        valueOfTodayUsage: 0,
        numberOfUsedAtLeastOnce: 0,
        usedToAllValue: 0, // = number of words used at least once / IDs.len()

        IDs: [],
        IDsSortedByUsage: []

      },

      'texts': {

        IDs: [],
        latestUsed: null // ID

      },

      'settings': {

        latestLaunchDate: new Date()

      }

    },

    loadCFG( name ){

      this.getItem( name ).then( ( data ) => { this.CFGs[ name ] = data; } );

    },

    setCFG( name ){

      this.setItem( name, this.CFGs[ name ] );

    },

    async getItem( name ){

      let item = undefined;

      try {

        item = await AsyncStorage.getItem( name );

        if( item !== undefined ){

          return item;

        }

      } catch (error) {

        console.log( error.message ); // ADD: LOGGER

      }

      return item;

    },

    async multiGet( name ){

      let item = undefined;

      try {

        item = await AsyncStorage.multiGet( name );

        return item;

      } catch (error) {

        console.log( error.message ); // ADD: LOGGER

      }

      return

    },

    async setItem( name, data ){

      try {

        await AsyncStorage.setItem( name, JSON.stringify(data) );

      } catch (error) {

        console.log( error.message ); // ADD: LOGGER

      }

    },

    async deleteItem( name ){

      try {

        await AsyncStorage.removeItem( name );

      } catch (error) {
        
        console.log(error.message);  // ADD: LOGGER

      }

    }

  }

}