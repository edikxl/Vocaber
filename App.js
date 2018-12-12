import React, { Component } from 'react';
import { WebView, StatusBar, AsyncStorage } from 'react-native';

export default class App extends Component {

  render() {

    // CHECK: IF RUNS EVERY RENDER

    if( !this.getItem( 'settings' ) ){ // If there is no any of dbs' config( for example settings' )

      this.DB.CFGs.keys().forEach( name => this.DB.setCFG( name ) ); // Use blanks to set them

    }else{ // If there are cfgs, load them

      this.DB.CFGs.keys().forEach( name => this.DB.loadCFG( name ) );

    }

    // ...

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

    msg = JSON.parse( e.nativeEvent.data );

    // CHECK: IF WORKS WITHOUT: this.webView.postMessage( JSON.stringify( { type: 'blank' } ) );

    let dataToSend = {

      requester: msg.ID,
      data: this.system[ msg.command ]( msg )

    };

    this.webView.postMessage( JSON.stringify( dataToSend ) );

  }

  // System

  system = {

    //CHECK: IF WORKS WITHOUT: DB: this.DB, 

    'get': ( msg ) => {

      data = null;

      if( msg.sortBy == "date" ){

        //data = this.dbs[ msg.db ][-msg.number:-1];

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
        usedWordsToAllWordsValue: 0, // = number of used at least once / wordsIDs.len()

        wordsIDs: [],
        IDsSortedByUsage: []

      },

      'texts': {

        textsIDs: [],
        latestUsed: null // ID

      },

      'settings': {

        latestLaunchDate: new Date()

      }

    }

    loadCFG( name ){

      this.CFGs[ name ] = this.getItem( name );

    }

    setCFG( name ){

      this.setItem( name, this.CFGs[ name ] );

    }

    async getItem( name ){

      let item = undefined;

      try {

        item = await AsyncStorage.getItem( name );

      } catch (error) {

        console.log( error.message ); // ADD: LOGGER

      }

      return item;

    }

    async setItem( name, data ){

      try {

        await AsyncStorage.setItem( name, data );

      } catch (error) {

        console.log( error.message ); // ADD: LOGGER

      }

    }

    async deleteItem( name ){

      try {

        await AsyncStorage.removeItem( name );

      } catch (error) {
        
        console.log(error.message);  // ADD: LOGGER

      }

    }

  }

}