import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [array, setArray] = useState([]);
  const [speed, setSpeed] = useState(100);
  const [size, setSize] = useState(50);

  useEffect(() => {
    resetArray();
  }, [size]);

  function Exit() { }

  function resetArray() {
    Exit();
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(randomIntFromInterval(5, 100));
    }
    setArray(arr);
  }

  async function animate(animations){
    for (let animation of animations) {
      const bars = document.getElementsByClassName('array-bar');
      if (animation.type === 'compare') {
        const [barOneIdx, barTwoIdx] = animation.indices;
        const barOneStyle = bars[barOneIdx].style;
        const barTwoStyle = bars[barTwoIdx].style;
        barOneStyle.backgroundColor = 'red';
        barTwoStyle.backgroundColor = 'red';
        await sleep(speed);
        barOneStyle.backgroundColor = 'blue';
        barTwoStyle.backgroundColor = 'blue';
      } else if (animation.type === 'swap') {
        const [barOneIdx, barTwoIdx] = animation.indices;
        const barOneStyle = bars[barOneIdx].style;
        const barTwoStyle = bars[barTwoIdx].style;
        const tempHeight = barOneStyle.height;
        barOneStyle.height = barTwoStyle.height;
        barTwoStyle.height = tempHeight;
        await sleep(speed);
      }
    }
  }

  function bubbleSort() {
    const arr = [...array];
    const animations = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        animations.push({ type: 'compare', indices: [j, j + 1] });
        if (arr[j] > arr[j + 1]) {
          animations.push({ type: 'swap', indices: [j, j + 1] });
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    animate(animations);
  }

  function selectionSort() {
    const arr = [...array];
    const animations = [];
    for (let i = 0; i < arr.length; i++) {
      let min = i;
      for (let j = i; j < arr.length; j++){
        if (arr[j] < arr[min]){
          animations.push({ type: 'compare', indices: [min, j] });
          min = j;
        }
      }
      animations.push({ type: 'swap', indices: [i, min] });
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
    animate(animations);
  }

  function insertionSort() {
    const arr = [...array];
    const animations = [];
    for (let i = 1; i < arr.length; i++) {
      let curr = i;
      while (arr[curr] < arr[curr - 1] & curr > 0){
        animations.push({ type: 'compare', indices: [curr - 1, curr] });
        animations.push({ type: 'swap', indices: [curr - 1, curr] });
        let temp = arr[curr];
        arr[curr] = arr[curr - 1];
        arr[curr - 1] = temp;
        curr -= 1;
      }
    }
    animate(animations);
    
  }

  function quickSort() {
    var arr = [...array];
    const animations = [];

    function quickSortHelper(l, r){
      if (l >=  r){
        return;
      }

      let pivot = find_pivot(l, r);
      quickSortHelper(l, pivot - 1);
      quickSortHelper(pivot + 1, r);
    }

    function find_pivot(a, b){
      let pivot_value = arr[b];
      let pivot_index = a;

      for (let i = a; i < b; i++) {
        animations.push({ type: 'compare', indices: [i, b] });
        if (arr[i] < pivot_value) {
          animations.push({ type: 'swap', indices: [i, pivot_index] });
          let temp = arr[i];
          arr[i] = arr[pivot_index];
          arr[pivot_index] = temp;
          pivot_index++;
        }
      }
      animations.push({ type: 'swap', indices: [b, pivot_index] });
      let temp = arr[b];
      arr[b] = arr[pivot_index];
      arr[pivot_index] = temp;
      return pivot_index;
    }
    quickSortHelper(0, arr.length - 1);
    animate(animations);
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sorting Algorithm Visualizer</h1>
        <div>
          <button onClick={resetArray}>Generate New Array</button>
          <button onClick={bubbleSort}>Bubble Sort</button>
          <button onClick={selectionSort}>Selection Sort</button>
          <button onClick={insertionSort}>Insertion Sort</button>
          <button onClick={quickSort}>Quick Sort</button>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <input
            type="range"
            min="10"
            max="100"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${value}%`,
                width: `calc(100% / ${size} - 2px)`,
              }}
            ></div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;