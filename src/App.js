import React, {useState, useEffect} from 'react';
import './App.css';
import useWindowDimensions from "./dimensions";
import {useGesture} from "react-with-gesture";
import clamp from "lodash-es/clamp";
import {animated, useSpring} from 'react-spring'

// spin 3s linear infinite

const IMAGES = [
  'https://i.imgur.com/sUBPiUJ.png',
  'https://i.imgur.com/QnqSVWm.png',
  'https://i.imgur.com/E4xGjmt.png'
];

function App() {
  const {height, width} = useWindowDimensions();
  const r = width / 3;
  let clickTimeout = null;

  useEffect(() => IMAGES.forEach(src => new Image().src = src)); // prefetch images

  const [currentImage, setCurrentImage] = useState(0);

  const [{xy}, setXy] = useSpring(() => ({xy: [0, 0]}));
  const bind = useGesture(({down, delta, velocity}) => {
    velocity = clamp(velocity, 1, 8);
    setXy({xy: down ? delta : [0, 0], config: {mass: velocity, tension: 500 * velocity, friction: 50}})
  });

  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  const handleClicks = () => {
    if (clickTimeout !== null) {
      setCurrentImage(safeIndex(currentImage + 1));
      setFlipped(flipped => !flipped);
      clearTimeout(clickTimeout);
      clickTimeout = null
    } else {
      clickTimeout = setTimeout(() => {
        clearTimeout(clickTimeout);
        clickTimeout = null
      }, 500)
    }
  };

  console.error(opacity);

  const safeIndex = (i) => (i % IMAGES.length);

  return (
    <div className="App">
      <header className="App-header">
        <animated.div {...bind()} style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), position: 'absolute', top: 0}}>
          <button onClick={() => handleClicks()}>
            <img className="imager" width={r} src={IMAGES[currentImage]} alt="alt"/>
          </button>
        </animated.div>
      </header>
    </div>
  );
}


export default App;
