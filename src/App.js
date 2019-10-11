import React, {useEffect, useState} from 'react';
import './App.css';
import useWindowDimensions from "./dimensions";
import {useGesture} from "react-with-gesture";
import clamp from "lodash-es/clamp";
import {animated, useSpring} from 'react-spring'

const IMAGES = [
  'https://i.imgur.com/sUBPiUJ.png',
  'https://i.imgur.com/QnqSVWm.png',
  'https://i.imgur.com/E4xGjmt.png'
];

function App() {
  const {height, width} = useWindowDimensions();

  useEffect(() => IMAGES.forEach(src => new Image().src = src)); // prefetch images

  const [frontImage, setFrontImage] = useState(0);
  const [backImage, setBackImage] = useState(1);

  const [{xy}, setXy] = useSpring(() => ({xy: [0, 0]}));
  const bind = useGesture(({down, delta, velocity}) => {
    velocity = clamp(velocity, 1, 8);
    setXy({xy: down ? delta : [0, 0], config: {mass: velocity, tension: 500 * velocity, friction: 50}})
  });

  const [flipped, setFlipped] = useState(false);
  const {transform, opacity} = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: {mass: 5, tension: 500, friction: 80}
  });

  let doubleClickTimeout = null;

  const handleClicks = () => {
    if (doubleClickTimeout !== null) {

      // we detected a double-click

      if (flipped) {
        setTimeout(() => {
          setBackImage(nextUnusedImage());
        }, 1000);
      } else {
        setTimeout(() => {
          setFrontImage(nextUnusedImage());
        }, 1000);
      }
      setFlipped(f => !f);

      clearTimeout(doubleClickTimeout);
      doubleClickTimeout = null
    } else {
      doubleClickTimeout = setTimeout(() => {
        clearTimeout(doubleClickTimeout);
        doubleClickTimeout = null
      }, 500)
    }
  };

  const nextUnusedImage = () => {
    for (let i = 0; i < IMAGES.length; i++) {
      if (i !== frontImage && i !== backImage) {
        return i;
      }
    }
  };

  const maxWidth = width * 0.8;
  const maxHeight = height / 2;
  let textsPaddingBottom = 10;
  if (maxHeight > maxWidth) {
    textsPaddingBottom = 100;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="texts" style={{paddingBottom: textsPaddingBottom}}>
          <img style={{maxWidth: maxWidth, maxHeight: maxHeight}} src="https://i.imgur.com/RS3aQRy.png" alt="texts"/>
        </div>
        <animated.div className="grabber" {...bind()} style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), position: 'absolute', top: 0}}>
          <div onClick={() => handleClicks()}>
            <animated.div className="flipper-side" style={{opacity: opacity.interpolate(o => 1 - o), transform}}>
              <img className="imager" style={{maxWidth: maxWidth, maxHeight: maxHeight}} src={IMAGES[frontImage]} alt="alt"/>
            </animated.div>
            <animated.div className="flipper-side" style={{opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`)}}>
              <img className="imager" style={{maxWidth: maxWidth, maxHeight: maxHeight}} src={IMAGES[backImage]} alt="alt"/>
            </animated.div>
          </div>
        </animated.div>
      </header>
    </div>
  );
}

export default App;

