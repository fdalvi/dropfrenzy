function updateScoreTable() {
	if(typeof(Storage)!=="undefined") {
		if(localStorage.highscore1 != -1) {
			$('.highscore1').text(localStorage.highscore1);
			$('.highscore1_time').text(localStorage.highscore1_time);
		} else {
			$('.highscore1').text(' - ');
			$('.highscore1_time').text(' - ');
		}
		if(localStorage.highscore2 != -1) {
			$('.highscore2').text(localStorage.highscore2);
			$('.highscore2_time').text(localStorage.highscore2_time);
		} else {
			$('.highscore2').text(' - ');
			$('.highscore2_time').text(' - ');
		}
		if(localStorage.highscore3 != -1) {
			$('.highscore3').text(localStorage.highscore3);
			$('.highscore3_time').text(localStorage.highscore3_time);
		} else {
			$('.highscore3').text(' - ');
			$('.highscore3_time').text(' - ');
		}
		if(localStorage.highscore4 != -1) {
			$('.highscore4').text(localStorage.highscore4);
			$('.highscore4_time').text(localStorage.highscore4_time);
		} else {
			$('.highscore4').text(' - ');
			$('.highscore4_time').text(' - ');
		}
		if(localStorage.highscore5 != -1) {
			$('.highscore5').text(localStorage.highscore5);
			$('.highscore5_time').text(localStorage.highscore5_time);
		} else {
			$('.highscore5').text(' - ');
			$('.highscore5_time').text(' - ');
		}
	}
}

function initScores() {
	if(typeof(Storage)!=="undefined") {
		if(localStorage.highscore1 == null) {
			localStorage.highscore1 = -1;
			localStorage.highscore2 = -1;
			localStorage.highscore3 = -1;
			localStorage.highscore4 = -1;
			localStorage.highscore5 = -1;
		}

		updateScoreTable();
	} else {
		$("#scoreSelection").hide();
	}
}

function clearScores() {
	if(typeof(Storage)!=="undefined") {
		localStorage.highscore1 = -1;
		localStorage.highscore2 = -1;
		localStorage.highscore3 = -1;
		localStorage.highscore4 = -1;
		localStorage.highscore5 = -1;


		updateScoreTable();
	} else {
		$("#scoreSelection").hide();
	}
}

function insertScoreAtPos1(newScore, currentTime) {
	if(localStorage.highscore1 < newScore) {
		localStorage.highscore2 = localStorage.highscore1;
		localStorage.highscore2_time = localStorage.highscore1_time;
		localStorage.highscore1 = newScore;
		localStorage.highscore1_time = currentTime;
	}
}

function insertScoreAtPos2(newScore, currentTime) {
	if(localStorage.highscore2 < newScore) {
		localStorage.highscore3 = localStorage.highscore2;
		localStorage.highscore3_time = localStorage.highscore2_time;
		localStorage.highscore2 = newScore;
		localStorage.highscore2_time = currentTime;

		insertScoreAtPos1(newScore, currentTime);
	}
}

function insertScoreAtPos3(newScore, currentTime) {
	if(localStorage.highscore3 < newScore) {
		localStorage.highscore4 = localStorage.highscore3;
		localStorage.highscore4_time = localStorage.highscore3_time;
		localStorage.highscore3 = newScore;
		localStorage.highscore3_time = currentTime;

		insertScoreAtPos2(newScore, currentTime);
	}
}

function insertScoreAtPos4(newScore, currentTime) {
	if(localStorage.highscore4 < newScore) {
		localStorage.highscore5 = localStorage.highscore4;
		localStorage.highscore5_time = localStorage.highscore4_time;
		localStorage.highscore4 = newScore;
		localStorage.highscore4_time = currentTime;

		insertScoreAtPos3(newScore, currentTime);
	}
}

function insertScoreAtPos5(newScore, currentTime) {
	if(localStorage.highscore5 < newScore) {
		localStorage.highscore5 = newScore;
		localStorage.highscore5_time = currentTime;

		insertScoreAtPos4(newScore, currentTime);
	}
}

function addNewScore(newScore) {
	var currentTime = new Date().toUTCString();
	console.log(currentTime);

	if(typeof(Storage)!=="undefined") {
		// First check if empty slots are available
		if(localStorage.highscore1 == -1) {
			insertScoreAtPos1(newScore, currentTime);
		} else if (localStorage.highscore2 == -1) {
			insertScoreAtPos2(newScore, currentTime);
		} else if (localStorage.highscore3 == -1) {
			insertScoreAtPos3(newScore, currentTime);
		} else if (localStorage.highscore4 == -1) {
			insertScoreAtPos4(newScore, currentTime);
		} else if (localStorage.highscore5 == -1) {
			insertScoreAtPos5(newScore, currentTime);
		} else {
			insertScoreAtPos5(newScore, currentTime);
		}
	}

	updateScoreTable();
}