const xlsx = require( 'node-xlsx' );
const fs = require( 'fs' );
const path = require( 'path' );

const sourcePath = './';
const savePath = './json';
const excelName = 'i18n-sports.xlsx';

class Translate {
  constructor() {
    this.contents = {};
    this.languages = [];
    this.sheets = undefined;
  }
  parseExcel ( sourcePath, excelName ) {
    this.sheets = xlsx.parse( fs.readFileSync( path.join( __dirname, sourcePath, excelName ) ) );
    this.parseSheet.bind(this);
    return this;
  }
  parseSheet () {
    let { data, name } = this.sheets[0];
    console.log( name )
    data.forEach( ( row, rowIndex ) => {
      let key;
      // console.log(row)
      row.forEach( ( col, colIndex ) => {
        if ( rowIndex === 0 && colIndex !== 0 ) {
          if ( !( col in this.contents ) ) {
            console.log(col)
            this.contents[col] = {};
            this.languages.push( col );
          }
        }
        console.log('this.languages', this.languages);
        if ( rowIndex >= 1 ) {
          if ( colIndex === 0 ) {
            key = col;
          } else {
            const lang = this.languages[colIndex - 1];
            console.log('colIndex', colIndex);
            this.contents[lang][key] = col;
          }
        }
      } )
    } );

    return this;
  }
  generatorJson ( savePath ) {
    Object.keys( this.contents ).forEach( key => {
      const targetPath = path.resolve( __dirname, savePath, `${key}.json` );
      fs.writeFile( targetPath, JSON.stringify( this.contents[key], null, 2 ), res => {
        console.log( `translate ${key} success` );
      } )
    } )
  }
}

new Translate().parseExcel( sourcePath, excelName ).generatorJson( savePath );
