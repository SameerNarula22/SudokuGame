const easy = [
	'6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------',
	'685329174971485326234761859362574981549618732718293465823946517197852643456137298',
];
const medium = [
	'--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---',
	'619472583243985617587316924158247369926531478734698152891754236365829741472163895',
];
const hard = [
	'-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--',
	'712583694639714258845269173521436987367928415498175326184697532253841769976352841',
];

let selectedCell;
let difficulty = easy[0];
let answer = [''];
let diffNum = 1;

window.onload = function () {
	startGame();
};

function changeDifficulty(n) {
	switch (n) {
		case 1:
			difficulty = easy[0];
			break;
		case 2:
			difficulty = medium[0];
			break;
		case 3:
			difficulty = hard[0];
			break;
		default:
			difficulty = easy[0];
	}
	diffNum = n;
	startGame();
}

function updateMove() {
	if (selectedCell) {
		document.addEventListener(
			'keydown',
			(event) => {
				const name = event.key;
				if (name >= '1' && name <= '9' && cani(Number(name))) {
					selectedCell.textContent = name;
					addToArray(name);
					addToCache();
				} else if (name === '0') {
					selectedCell.textContent = null;
					removeFromArray();
				}
			},
			false
		);
	}
	highSelect();
}

function startGame() {
	fillAns(difficulty);
	createBoard(difficulty);
	if (sessionStorage.getItem('cache')) {
		const saved = sessionStorage.getItem('cache').split(',');
		answer = saved;
		for (let i = 0; i < 81; i++) {
			if (saved[i] !== '-' && saved[i] !== difficulty[i]) {
				qA('.cell')[i].classList.add('modified');
				id(i).textContent = saved[i];
			}
		}
	}
}

function highSelect() {
	for (let i = 0; i < 81; i++) {
		qA('.cell')[i].classList.remove('highlighted', 'dup');
	}
	const col = parseInt(selectedCell.id % 9);
	const row = parseInt(selectedCell.id / 9);
	const s = selectedCell.id;
	for (let i = 0; i < 81; i++) {
		if (parseInt(selectedCell.textContent) === answer[i]) {
			id(i).classList.add('dup');
		}
	}
	for (let i = col; i < col + 73; i += 9) {
		if (i !== s) {
			id(i).classList.add('highlighted');
		}
	}
	for (let i = row * 9; i < row * 9 + 9; i++) {
		if (i !== s) {
			id(i).classList.add('highlighted');
		}
	}
}

function createBoard(board) {
	clearPrevious();
	let idCell = 0;
	for (let i = 0; i < 81; i++) {
		const cell = document.createElement('p');
		if (board.charAt(i) !== '-') {
			cell.textContent = board.charAt(i);
			cell.classList.add('prefilled');
		} else {
			cell.addEventListener('click', function () {
				if (cell.classList.contains('selected')) {
					cell.classList.remove('selected');
					selectedCell = null;
				} else {
					for (let i = 0; i < 81; i++) {
						qA('.cell')[i].classList.remove('selected');
					}
				}
				cell.classList.add('selected');
				selectedCell = cell;
				updateMove();
			});
		}
		cell.id = idCell;
		idCell++;
		cell.classList.add('cell');
		if ((cell.id > 17 && cell.id < 27) || (cell.id > 44 && cell.id < 54)) {
			cell.classList.add('bottomBorder');
		}
		if ((cell.id + 1) % 9 === 0) {
			cell.classList.add('rightBorder');
		}
		q('#board').appendChild(cell);
	}
}

function clearPrevious() {
	const cells = qA('.cell');
	for (let i = 0; i < cells.length; i++) {
		cells[i].remove();
	}
}

function fillAns(board) {
	let arr = [];
	for (let i = 0; i < board.length; i++) {
		arr.push(board.charAt(i));
	}
	answer = arr;
}

function addToArray(val) {
	const id = selectedCell.id;
	if (answer[id] !== val) {
		answer[id] = val;
	}
}

function removeFromArray() {
	const id = selectedCell.id;
	answer[id] = '-';
}

function addToCache() {
	sessionStorage.setItem('cache', answer.toString());
}

function validate() {
	let valid = true;
	for (let i = 0; i < 81; i++) {
		if (
			qA('.cell')[i].textContent !== answer[i] &&
			qA('.cell')[i].textContent !== '-'
		) {
			qA('.cell')[i].classList.add('incorrect');
			valid = false;
		}
	}
	if (valid) {
		alert('You solved the puzzle!');
	}
}

function reset() {
	sessionStorage.removeItem('cache');
	answer = Array(81).fill('-');
	startGame();
}

function q(selector) {
	return document.querySelector(selector);
}

function qA(selector) {
	return document.querySelectorAll(selector);
}

function id(id) {
	return document.getElementById(id);
}

function cani(val) {
	const row = Math.floor(selectedCell.id / 9);
	const col = selectedCell.id % 9;
	for (let i = 0; i < 81; i++) {
		if (
			Math.floor(i / 9) === row &&
			i !== selectedCell.id &&
			qA('.cell')[i].textContent === String(val)
		) {
			return false;
		}
		if (
			i % 9 === col &&
			i !== selectedCell.id &&
			qA('.cell')[i].textContent === String(val)
		) {
			return false;
		}
	}
	return true;
}
