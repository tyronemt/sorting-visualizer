// script.js

const arrayContainer = document.getElementById('array-container');
const resetBtn = document.getElementById('reset-btn');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const bogoSortBtn = document.getElementById('bogo-sort-btn'); // New button
const bubbleSortBtn = document.getElementById('bubble-sort-btn');
const insertionSortBtn = document.getElementById('insertion-sort-btn');
const selectionSortBtn = document.getElementById('selection-sort-btn');
const mergeSortBtn = document.getElementById('merge-sort-btn');
const quickSortBtn = document.getElementById('quick-sort-btn');
const shellSortBtn = document.getElementById('shell-sort-btn');
const countingSortBtn = document.getElementById('counting-sort-btn');
const radixSortBtn = document.getElementById('radix-sort-btn');

let array = [];
let isSorting = false;

// Web Audio API setup
let audioCtx = null;

function playSound(value, duration = 100, volume = 0.1) {
    if (audioCtx === null) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const frequency = value + 200;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
}

// Define colors for clarity
const PRIMARY_COLOR = '#007bff';
const COMPARE_COLOR = 'red';
const SWAP_COLOR = 'yellow';
const PIVOT_COLOR = 'purple';
const PARTITION_COLOR = '#FFA500';
const SORTED_COLOR = '#28a745';

function createNewArray(size) {
    array = [];
    arrayContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        let value = Math.floor(Math.random() * 350) + 10;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${100 / size}%`;
        arrayContainer.appendChild(bar);
    }
}

function disableControls() {
    isSorting = true;
    resetBtn.disabled = true;
    sizeSlider.disabled = true;
    bogoSortBtn.disabled = true;
    bubbleSortBtn.disabled = true;
    insertionSortBtn.disabled = true;
    selectionSortBtn.disabled = true;
    mergeSortBtn.disabled = true;
    quickSortBtn.disabled = true;
    shellSortBtn.disabled = true;
    countingSortBtn.disabled = true;
    radixSortBtn.disabled = true;
}

async function enableControls() {
    await showCompletionAnimation();
    isSorting = false;
    resetBtn.disabled = false;
    sizeSlider.disabled = false;
    bogoSortBtn.disabled = false;
    bubbleSortBtn.disabled = false;
    insertionSortBtn.disabled = false;
    selectionSortBtn.disabled = false;
    mergeSortBtn.disabled = false;
    quickSortBtn.disabled = false;
    shellSortBtn.disabled = false;
    countingSortBtn.disabled = false;
    radixSortBtn.disabled = false;
}

async function showCompletionAnimation() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = SORTED_COLOR;
        playSound(array[i]);
        await sleep(15);
    }
}

function getDelay() {
    return 101 - speedSlider.value;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

resetBtn.addEventListener('click', () => {
    if (!isSorting) {
        createNewArray(sizeSlider.value);
    }
});

sizeSlider.addEventListener('input', () => {
    if (!isSorting) {
        createNewArray(sizeSlider.value);
    }
});

// Event Listeners
bogoSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    if (array.length > 10 && !confirm("Bogo Sort is extremely inefficient and may not finish for arrays larger than 10. Proceed anyway?")) {
        return; // User cancelled the sort
    }
    disableControls();
    await bogoSort();
    await enableControls();
});

bubbleSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await bubbleSort();
    await enableControls();
});

insertionSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await insertionSort();
    await enableControls();
});

selectionSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await selectionSort();
    await enableControls();
});

mergeSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await mergeSort(0, array.length - 1);
    await enableControls();
});

quickSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await quickSort(0, array.length - 1);
    await enableControls();
});

shellSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await shellSort();
    await enableControls();
});

countingSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await countingSort();
    await enableControls();
});

radixSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await radixSort();
    await enableControls();
});

// --- Sorting Algorithms ---

function isSorted() {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return false;
        }
    }
    return true;
}

async function shuffle() {
    const bars = document.getElementsByClassName('bar');
    let n = array.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        bars[i].style.backgroundColor = SWAP_COLOR;
        bars[j].style.backgroundColor = SWAP_COLOR;
        await sleep(getDelay());
        [array[i], array[j]] = [array[j], array[i]];
        bars[i].style.height = `${array[i]}px`;
        bars[j].style.height = `${array[j]}px`;
        playSound(array[i]);
        playSound(array[j]);
        bars[i].style.backgroundColor = PRIMARY_COLOR;
        bars[j].style.backgroundColor = PRIMARY_COLOR;
    }
}

async function bogoSort() {
    while (!isSorted()) {
        await shuffle();
    }
}

async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = COMPARE_COLOR;
            bars[j + 1].style.backgroundColor = COMPARE_COLOR;
            await sleep(getDelay());

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;
                playSound(array[j]);
                playSound(array[j+1]);
            }
            bars[j].style.backgroundColor = PRIMARY_COLOR;
            bars[j + 1].style.backgroundColor = PRIMARY_COLOR;
        }
    }
}

async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = COMPARE_COLOR;
        await sleep(getDelay());

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            playSound(array[j+1]);
            bars[j].style.backgroundColor = COMPARE_COLOR;
            await sleep(getDelay());
            bars[j].style.backgroundColor = PRIMARY_COLOR;
            j = j - 1;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        playSound(key);
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }
}

async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
        let min_idx = i;
        bars[i].style.backgroundColor = COMPARE_COLOR;
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = SWAP_COLOR;
            await sleep(getDelay());
            if (array[j] < array[min_idx]) {
                if (min_idx !== i) {
                    bars[min_idx].style.backgroundColor = PRIMARY_COLOR;
                }
                min_idx = j;
            } else {
                 bars[j].style.backgroundColor = PRIMARY_COLOR;
            }
        }
        
        [array[i], array[min_idx]] = [array[min_idx], array[i]];
        bars[i].style.height = `${array[i]}px`;
        bars[min_idx].style.height = `${array[min_idx]}px`;
        playSound(array[i]);
        playSound(array[min_idx]);
        bars[min_idx].style.backgroundColor = PRIMARY_COLOR;
        bars[i].style.backgroundColor = PARTITION_COLOR;
    }
}

async function shellSort() {
    const bars = document.getElementsByClassName('bar');
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i += 1) {
            let temp = array[i];
            let j;
            bars[i].style.backgroundColor = COMPARE_COLOR;
            await sleep(getDelay());

            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                bars[j].style.backgroundColor = SWAP_COLOR;
                bars[j - gap].style.backgroundColor = SWAP_COLOR;
                await sleep(getDelay());
                array[j] = array[j - gap];
                bars[j].style.height = `${array[j]}px`;
                playSound(array[j]);
                bars[j].style.backgroundColor = PRIMARY_COLOR;
                bars[j - gap].style.backgroundColor = PRIMARY_COLOR;
            }
            array[j] = temp;
            bars[j].style.height = `${array[j]}px`;
            playSound(array[j]);
            bars[i].style.backgroundColor = PRIMARY_COLOR;
        }
    }
}

async function mergeSort(l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    const bars = document.getElementsByClassName('bar');
    for(let i = l; i <= r; i++) {
        bars[i].style.backgroundColor = PARTITION_COLOR;
    }
    await sleep(getDelay());

    const n1 = m - l + 1;
    const n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        bars[k].style.height = `${array[k]}px`;
        playSound(array[k]);
        bars[k].style.backgroundColor = COMPARE_COLOR;
        await sleep(getDelay());
        k++;
    }
    while (i < n1) {
        array[k] = L[i];
        bars[k].style.height = `${array[k]}px`;
        playSound(array[k]);
        bars[k].style.backgroundColor = COMPARE_COLOR;
        await sleep(getDelay());
        i++;
        k++;
    }
    while (j < n2) {
        array[k] = R[j];
        bars[k].style.height = `${array[k]}px`;
        playSound(array[k]);
        bars[k].style.backgroundColor = COMPARE_COLOR;
        await sleep(getDelay());
        j++;
        k++;
    }
    for(let i = l; i <= r; i++) {
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }
}

async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.getElementsByClassName('bar');
    for(let k = low; k <= high; k++) {
        bars[k].style.backgroundColor = PARTITION_COLOR;
    }
    await sleep(getDelay());

    let pivot = array[high];
    bars[high].style.backgroundColor = PIVOT_COLOR;
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
        bars[j].style.backgroundColor = SWAP_COLOR;
        await sleep(getDelay());
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            playSound(array[i]);
            playSound(array[j]);
            bars[i].style.backgroundColor = PARTITION_COLOR;
            if (i !== j) bars[j].style.backgroundColor = PARTITION_COLOR;
        } else {
             bars[j].style.backgroundColor = PARTITION_COLOR;
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;
    playSound(array[i+1]);
    playSound(array[high]);
    
    for(let k = low; k <= high; k++) {
        bars[k].style.backgroundColor = PRIMARY_COLOR;
    }
    return (i + 1);
}

async function countingSort() {
    const bars = document.getElementsByClassName('bar');
    let max = Math.max(...array);
    let count = new Array(max + 1).fill(0);

    for (let i = 0; i < array.length; i++) {
        bars[i].style.backgroundColor = SWAP_COLOR;
        await sleep(getDelay());
        count[array[i]]++;
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }

    let j = 0;
    for (let i = 0; i <= max; i++) {
        while (count[i] > 0) {
            bars[j].style.backgroundColor = COMPARE_COLOR;
            await sleep(getDelay());
            array[j] = i;
            bars[j].style.height = `${array[j]}px`;
            playSound(array[j]);
            bars[j].style.backgroundColor = PRIMARY_COLOR;
            count[i]--;
            j++;
        }
    }
}

async function radixSort() {
    const bars = document.getElementsByClassName('bar');
    let max = Math.max(...array);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortForRadix(exp);
    }
}

async function countingSortForRadix(exp) {
    const bars = document.getElementsByClassName('bar');
    let n = array.length;
    let output = new Array(n);
    let count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
        count[Math.floor(array[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
        let digit = Math.floor(array[i] / exp) % 10;
        bars[i].style.backgroundColor = COMPARE_COLOR;
        await sleep(getDelay());
        output[count[digit] - 1] = array[i];
        count[digit]--;
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }

    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        bars[i].style.height = `${array[i]}px`;
        playSound(array[i]);
        bars[i].style.backgroundColor = SWAP_COLOR;
        await sleep(getDelay());
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }
}

// Initial array generation
createNewArray(sizeSlider.value);