const canvas = document.getElementById('gameCanvas');
const resetButton = document.getElementById('resetButton');
const winMsg = document.getElementById('winMsg');

const ctx = canvas.getContext('2d');

let board;
let move;
let offset;

let img = new Image();

function drawBoard() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.width;

	offset = (canvas.width - 24) / 5;
	ctx.fillStyle = 'black';
	for (let i = 0; i < 6; i++) {
		ctx.fillRect(i * offset + i * 4, 0, 4, canvas.width);
		ctx.fillRect(0, i * offset + i * 4, canvas.width, 4);
	}
}

function startGame() {
	winMsg.style.visibility = 'hidden';
	board = [];
	for (let i = 0; i < 25; i++) {
		board[i] = '-';
	}
	move = 0;
	
	drawBoard();
}

resetButton.addEventListener('click', startGame);
window.addEventListener('load', startGame);

canvas.addEventListener('click', e => {
	const canvasPos = canvas.getBoundingClientRect();

	const pointerX = e.clientX - canvasPos.left;
	const pointerY = e.clientY - canvasPos.top;

	const column = Math.floor(pointerX / (offset + 4));
	const row = Math.floor(pointerY / (offset + 4));

	const index = row * 5 + column;

	if (board[index] === '-') {
		if (move % 2 === 0) {
			img.src = 'images/x.png';
			board[index] = 'x';
		} else {
			img.src = 'images/o.png';
			board[index] = 'o';
		}
		img.onload = () => {
			ctx.drawImage(img, 0, 0, img.width, img.height, column * offset + (column + 1) * 4, row * offset + (row + 1) * 4, offset, offset);
		}
		move++;

		if (checkWin()) {
			winMsg.style.visibility = 'visible';
		}
	}
});

function checkWin(index, sign) {
	const column = index % 5;
	const row = Math.floor(index / 5);

	// gora - dol
	let countX = 0;
	let countO = 0;
	for (let i = 0; i < 5; i++) {
		if (board[i * 5 + row] === 'x') countX++;
		else if (board[i * 5 + row] === 'o') countO++;
	}

	if (sign === 'x' && countX >= 4) {
		for (let i = 5; i <= 15; i += 5) {
			if (board[i + row] !== 'x') return false;
		}
		return true;
	}

	if (sign === 'o' && countO >= 4) {
		for (let i = 5; i <= 15; i += 5) {
			if (board[i + row] !== 'o') return false;
		}
		return true;
	}

	// lewo - prawo
	countX = 0;
	countO = 0;
	for (let i = 0; i < 5; i++) {
		if (board[column * 5 + i] === 'x') countX++;
		else if (board[column * 5 + i] === 'o') countO++;
	}

	if (sign === 'x' && countX >= 4) {
		for (let i = 1; i < 4; i++) {
			if (board[column * 5 + i] !== 'x') return false;
		}
		return true;
	}

	if (sign === 'o' && countO >= 4) {
		for (let i = 1; i < 4; i++) {
			if (board[column * 5 + i] !== 'o')  return false;
		}
		return true;
	}

	// lewo gora - prawo dol
	if (row + 1 === column) {
		for (let i = 1; i <= 19; i += 6) {
			if (board[i] !== sign) return false;
		}
		return true;
	}

	if (row - 1 === column) {
		for (let i = 5; i <= 23; i += 6) {
			if (board[i] !== sign) return false;
		}
		return true;
	}

	if (row === column) {
		countX = 0;
		countO = 0;

		for (let i = 0; i <= 24; i += 6) {
			if (board[i] === 'x') countX++;
			else if (board[i] === 'o') countO++;
		}

		if (sign === 'x' && countX >= 4) {
			for (let i = 6; i <= 18; i += 6) {
				if (board[i] !== 'x') return false;
			}
			return true;
		}
		if (sign === 'o' && countO >= 4) {
			for (let i = 6; i <= 18; i += 6) {
				if (board[i] !== 'o') return false;
			}
			return true;
		}
	}

	// lewo dol - prawo gora
	if (row + column === 3) {
		for (let i = 3; i <= 15; i += 4) {
			if (board[i] !== sign) return false;
		}
		return true;
	}

	if (row + column === 5) {
		for (let i = 9; i <= 21; i += 4) {
			if (board[i] !== sign) return false;
		}
		return true;
	}

	if (row + column === 4) {
		countX = 0;
		countO = 0;
		for (let i = 4; i <= 20; i += 4) {
			if (board[i] === 'x') countX++;
			else if (board[i] === 'o') countO++;
		}

		if (sign === 'x' && countX >= 4) {
			for (let i = 8; i <= 16; i += 4) {
				if (board[i] !== 'x') return false;
			}
			return true;
		}

		if (sign === 'o' && countO >= 4) {
			for (let i = 8; i <= 16; i += 4) {
				if (board[i] !== 'o') return false;
			}
			return true;
		}
	}
}