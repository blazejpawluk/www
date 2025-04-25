const gameDiv = document.getElementById('game');
const gameField = document.getElementById('gameField');
const puzzleCanvas = document.getElementById('puzzleCanvas');
const winMessage = document.getElementById('winMessage');
const resetButton = document.getElementById('resetButton');

const settingsDiv = document.getElementById('settings');
const imageInput = document.getElementById('imageInput');
const rowsInput = document.getElementById('rowsInput');
const columnInput = document.getElementById('columnInput');
const startButton = document.getElementById('startButton');

const ctx = puzzleCanvas.getContext('2d');

const images = [
	// 'images/bombardiroCrocodilo.jpg',
	// 'images/tralaleroTralala.jpg',
	// 'images/tungTungSahur.jpg',
	'images/default.jpg'
];

const sounds = [
	// 'sounds/bombardiroCrocodilo.mp3',
	// 'sounds/tralaleroTralala.mp3',
	// 'sounds/tungTungSahur.mp3'
]

let img = new Image();
let rows;
let columns;
let tiles;
let size;
let tileWidth;
let tileHeight;
let emptyIndex;
let defaultImage;

// mieszanie obrazka
function shuffle() {
	let currentIndex = size - 1;

	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[tiles[currentIndex], tiles[randomIndex]] = [tiles[randomIndex], tiles[currentIndex]];
	}

	emptyIndex = tiles.indexOf('empty');
	[tiles[emptyIndex], tiles[0]] = [tiles[0], tiles[emptyIndex]];
	emptyIndex = 0;

	if (!isSolvable()) {
		shuffle();
	}
}

// sprawdzenie czy układanka jest możliwa
function isSolvable() {
	let invCount = 0;

	for (let i = 0; i < size - 1; i++) {
		for (let j = i + 1; j < size; j++) {
			if (tiles[i] > tiles[j]) {
				invCount++;
			}
		}
	}

	if (rows % 2 === 1) {
		return (invCount % 2 === 0);
	} else {
		return (invCount % 2 === 1);
	}
}

// wyświetlenie pomieszanego obrazka na canvas
function draw() {
	puzzleCanvas.width  = puzzleCanvas.clientWidth;
	puzzleCanvas.height = puzzleCanvas.clientHeight;
	
	const scale = puzzleCanvas.width / img.width;
	puzzleCanvas.height = img.height * scale;

	tileWidth = puzzleCanvas.width / columns;
	tileHeight = puzzleCanvas.height / rows;

	for (let i = 0; i < size; i++) {
		const column = i % columns;
		const row = Math.floor(i / columns);

		const x = column * tileWidth;
		const y = row * tileHeight;

		if (tiles[i] === 'empty') {
			ctx.fillStyle = 'blue';
			ctx.fillRect(x, y, tileWidth, tileHeight);
		} else {
			const sx = (tiles[i] % columns) * img.width / columns;
			const sy = Math.floor(tiles[i] / columns) * img.height / rows;

			ctx.drawImage(img, sx, sy, img.width / columns, img.height / rows, x, y, tileWidth, tileHeight);
		}
	}

	for (let i = 0; i < size; i++) {
		highlight(Math.floor(i / columns), i % columns, false);
	}

	puzzleCanvas.style.visibility = 'visible';
	winMessage.style.visibility = 'hidden';
	resetButton.style.visibility = 'visible';
}

window.addEventListener('resize', () => {
	if (tiles) draw();
});

// rozpoczęcie gry
startButton.addEventListener('click', () => {
	rows = parseInt(rowsInput.value) || 3;
	columns = parseInt(columnInput.value) || 3;
	size = rows * columns;

	tiles = Array.from({length: size}, (_, i) => i);
	tiles[size - 1] = 'empty';
	shuffle();

	img = new Image();
	img.onload = () => draw();
	if (imageInput.files[0]) {
		if (!imageInput.files[0].type.startsWith('image/')) {
			alert('Wybierz plik typu obraz.');
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			img.src = reader.result;
		}
		reader.readAsDataURL(imageInput.files[0]);

		img.src = URL.createObjectURL(imageInput.files[0]);

		defaultImage = -1;
		imageInput.value = "";
	} else {
		const randIndex = Math.floor(Math.random() * images.length);
		img.src = images[randIndex];
		defaultImage = randIndex;
	}

	saveState();
});
resetButton.addEventListener('click', () => {
	startButton.click();
})

// sprawdzenie czy pola są sąsiadami
function isNeighbor(i, j) {
	if (Math.abs(i - j) === columns) {
		return true;
	}
	if (Math.abs(i - j) === 1 && Math.floor(i / columns) === Math.floor(j / columns)) {
		return true;
	}
	return false;
}

// obsługa kliknięcia w klocka
puzzleCanvas.addEventListener('pointerdown', e => {
	// pozycja canvas w oknie
	const canvasPos = puzzleCanvas.getBoundingClientRect();

	// pozycja myszki na canvas
	const pointerX = e.clientX - canvasPos.left;
	const pointerY = e.clientY - canvasPos.top;

	// kliknieta kolumna / wiersz
	const column = Math.floor(pointerX / tileWidth);
	const row = Math.floor(pointerY / tileHeight);
	const index = row * columns + column;

	if (isNeighbor(index, emptyIndex)) {
		[tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
		emptyIndex = index;
		draw();
	}

	if (gameWon()) {
		winMessage.style.visibility = 'visible';
		localStorage.removeItem('puzzle');
		// if (defaultImage != -1) {
		// 	let audio = new Audio(sounds[index]);
		// 	audio.play();
		// }
	} else {
		saveState();
	}
});

// dodanie / usunięcie ramki dookoła klocka
function highlight(row, column, add) {
	if (add) {
		ctx.fillStyle = '#333333';
	} else {
		ctx.fillStyle = '#dddddd';
	}

	let x = column * tileWidth - 5;
	let y = row * tileHeight - 5;
	ctx.fillRect(x, y, 10, tileHeight + 10);
	ctx.fillRect(x, y, tileWidth + 10, 10);

	x = (column + 1) * tileWidth - 5;
	ctx.fillRect(x, y, 10, tileHeight + 10);

	x = column * tileWidth - 5;
	y = (row + 1) * tileHeight - 5;
	ctx.fillRect(x, y, tileWidth + 10, 10);
}

// obsługa najechania na klocka
puzzleCanvas.addEventListener('pointermove', e => {
	puzzleCanvas.style.cursor = 'default';
	for (let i = 0; i < size; i++) {
		highlight(Math.floor(i / columns), i % columns, false);
	}

	// pozycja canvas w oknie
	const canvasPos = puzzleCanvas.getBoundingClientRect();

	// pozycja myszki na canvas
	const pointerX = e.clientX - canvasPos.left;
	const pointerY = e.clientY - canvasPos.top;

	// kliknieta kolumna / wiersz
	const column = Math.floor(pointerX / tileWidth);
	const row = Math.floor(pointerY / tileHeight);
	const index = row * columns + column;

	if (isNeighbor(index, emptyIndex)) {
		puzzleCanvas.style.cursor = 'pointer';
		highlight(row, column, true);
	}
});

// sprawdzenie wygranej
function gameWon() {
	if (tiles[size - 1] != 'empty') {
		return false;
	}

	for (let i = 0; i < size - 1; i++) {
		if (tiles[i] != i) {
			return false;
		}
	}
	return true;
}

// zapisanie do localStorage
function saveState() {
	localStorage.setItem('puzzle', JSON.stringify({
		defaultImage,
		imgSrc: img.src,
		columns,
		rows,
		tiles,
		emptyIndex
	}));
}

// ładowanie gry z localStorage
function loadState() {
	if (!localStorage.puzzle) {
		return;
	}

	const savedState = JSON.parse(localStorage.puzzle);
	console.log(savedState);

	defaultImage = savedState.defaultImage;
	img = new Image();
	if (defaultImage != -1) {
		img.src = images[defaultImage];
	} else {
		img.src = savedState.imgSrc;
	}
	columns = savedState.columns;
	rows = savedState.rows;
	size = rows * columns;
	tiles = savedState.tiles;
	emptyIndex = savedState.emptyIndex;

	img.onload = () => draw();
}

window.addEventListener('load', loadState);