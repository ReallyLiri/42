import React from 'react';
import './App.css';
import Lazy from 'react-lazyload'
import Loader from 'react-loader-spinner'

const Image = ({height, src}) => (
  <Lazy height={height} placeholder={<Loader type="Rings" color="red" height={80} width={80}/>}>
    <img style={{animation: `spin 3s linear infinite`}} height={height} src={src} alt="alt"/>
  </Lazy>
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Image height={200} src='https://i.imgur.com/sUBPiUJ.png'/>
        <Image height={200} src='https://i.imgur.com/QnqSVWm.png'/>
        <Image height={200} src='https://i.imgur.com/E4xGjmt.png'/>
      </header>
    </div>
  );
}


export default App;
