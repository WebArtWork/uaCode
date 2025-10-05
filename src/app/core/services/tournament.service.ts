import { inject, Injectable } from '@angular/core';
import { Uacodetournamentparticipation } from 'src/app/modules/uacodetournamentparticipation/interfaces/uacodetournamentparticipation.interface';
import { AlertService, HttpService } from 'wacom';
import { UacodeService } from './uacode.service';

export type TournamentMethod =
	| 'Rock, Paper, Scissors'
	| 'Magicians'
	| "The Prisoner's Dilemma";

/**
 * TournamentService handles game configuration, option validation,
 * and logic verification for tournament games.
 */
@Injectable({
	providedIn: 'root'
})
export class TournamentService {
	private _http = inject(HttpService);
	/**
	 * Supported game methods.
	 */
	methods = ['Rock, Paper, Scissors', "The Prisoner's Dilemma", 'Magicians'];

	/**
	 * Translations for method names to Ukrainian.
	 */
	nameTranslation: Record<string, string> = {
		'Rock, Paper, Scissors': `Камінь, ножиці, папір`,
		Magicians: 'Маги',
		"The Prisoner's Dilemma": `Дилема в'язня`
	};

	/**
	 * Allowed playable options for each game method.
	 */
	options: Record<string, string[]> = {
		'Rock, Paper, Scissors': ['камінь', 'папір', 'ножиці'],
		Magicians: ['атака', 'захист', 'лікування', 'медетація'],
		"The Prisoner's Dilemma": ['мовчати', 'зрадити']
	};

	/**
	 * Набір змінних, доступних для кожної гри у турнірах UA Code.
	 *
	 * Ключ — назва гри англійською.
	 * Значення — перелік змінних, які може використовувати учень у коді на UA Code.
	 * Кожна змінна подається окремим рядком (розділена \n).
	 *
	 * Це використовується для надання підказок учню щодо можливих змінних
	 * та їх назв для конкретної гри.
	 */
	availableVariables: Record<string, string> = {
		'Rock, Paper, Scissors': `Змінна мійОстаннійХід\nЗмінна суперникаОстаннійХід\nЗмінна кількістьМоїхКаменів\nЗмінна кількістьМоїхПаперів\nЗмінна кількістьМоїхНожиців\nЗмінна кількістьСуперникаКаменів\nЗмінна кількістьСуперникаПаперів\nЗмінна кількістьСуперникаНожиців`,
		Magicians:
			'Змінна моєОстаннєЗакляття\nЗмінна останнєЗакляттяСуперника\nЗмінна кількістьМоїхАтак\nЗмінна кількістьМоїхЗахистів\nЗмінна кількістьМоїхЛікувань\nЗмінна кількістьМоїхМедитацій\nЗмінна кількістьСуперникаАтак\nЗмінна кількістьСуперникаЗахистів\nЗмінна кількістьСуперникаЛікувань\nЗмінна кількістьСуперникаМедитацій\nЗмінна рівеньМогоЖиття\nЗмінна рівеньМоєїМани\nЗмінна рівеньЖиттяСуперника\nЗмінна рівеньМаниСуперника',
		"The Prisoner's Dilemma":
			'Змінна мійОстаннійВибір\nЗмінна останнійВибірСуперника\nЗмінна кількістьМоїхЗрад\nЗмінна кількістьМоїхМовчань\nЗмінна кількістьЗрадСуперника\nЗмінна кількістьМовчаньСуперника'
	};

	/**
	 * Приклади стратегій для кожної гри у форматі UA Code.
	 *
	 * Ключ — назва гри англійською.
	 * Значення — приклад коду (як текст), який демонструє базову стратегію
	 * з використанням доступних змінних і команд UA Code.
	 *
	 * Ці приклади використовуються для підказки або демонстрації синтаксису учням.
	 */
	codeSamples: Record<string, string> = {
		'Rock, Paper, Scissors': `Якщо (\n  кількістьСуперникаПаперів > кількістьСуперникаКаменів ТА \n  кількістьСуперникаПаперів > кількістьСуперникаНожиців\n) {\n  Поверни 'ножиці';\n} ІнакшеЯкщо (\n  кількістьСуперникаКаменів > кількістьСуперникаНожиців\n) {\n  Поверни 'папір';\n} Інакше {\n  Поверни 'камінь';\n}`,
		Magicians: `Якщо (рівеньМогоЖиття <= 30) {\n  Якщо (рівеньМоєїМани >= 20) {\n    Поверни 'лікування';\n  } Інакше {\n    Поверни 'медитація';\n  }\n} ІнакшеЯкщо (рівеньМоєїМани < 10) {\n  Поверни 'медитація';\n} ІнакшеЯкщо (\n  кількістьСуперникаАтак > кількістьСуперникаЗахистів\n) {\n  Поверни 'захист';\n} Інакше {\n  Поверни 'атака';\n}`,
		"The Prisoner's Dilemma": `Якщо (останнійВибірСуперника == 'зрадити') {\n  Поверни 'зрадити';\n} ІнакшеЯкщо (кількістьЗрадСуперника > кількістьМовчаньСуперника) {\n  Поверни 'зрадити';\n} Інакше {\n  Поверни 'мовчати';\n}`
	};

	/**
	 * Validation functions for user-submitted code scripts in each game type.
	 * Each function runs the code in a sandboxed loop to ensure valid game choices.
	 */
	scriptLogicVerification: Record<string, (code: string) => boolean> = {
		/**
		 * Validates "Rock, Paper, Scissors" strategy logic.
		 * Ensures returned values match valid options and does not throw.
		 */
		'Rock, Paper, Scissors': (code: string): boolean => {
			const options = this.options['Rock, Paper, Scissors'];

			let мійОстаннійХід = '';

			let суперникаОстаннійХід = '';

			let кількістьМоїхКаменів = 0;

			let кількістьМоїхПаперів = 0;

			let кількістьМоїхНожиців = 0;

			let кількістьСуперникаКаменів = 0;

			let кількістьСуперникаПаперів = 0;

			let кількістьСуперникаНожиців = 0;

			for (let i = 0; i < 999; i++) {
				try {
					const my_option = eval(`()=>{
						${code}
					}`)();

					if (!options.includes(my_option)) {
						return false;
					}

					мійОстаннійХід = my_option;

					const opponentOption = Math.floor(Math.random() * 3);

					суперникаОстаннійХід = options[opponentOption];

					if (options.indexOf(my_option) === 0) {
						кількістьМоїхКаменів++;
					} else if (options.indexOf(my_option) === 1) {
						кількістьМоїхПаперів++;
					} else {
						кількістьМоїхНожиців++;
					}

					if (opponentOption === 0) {
						кількістьСуперникаКаменів++;
					} else if (opponentOption === 1) {
						кількістьСуперникаПаперів++;
					} else {
						кількістьСуперникаНожиців++;
					}
				} catch (error: any) {
					this._alert.error({
						unique: 'code',
						text: 'Помилка в коді: ' + error.message
					});

					return false;
				}
			}

			return true;
		},
		/**
		 * Validates "Magicians" strategy logic.
		 * Simulates life/mana changes and checks for valid returned actions.
		 */
		Magicians: (code: string): boolean => {
			const options = this.options['Magicians'];

			let моєОстаннєЗакляття = '';
			let останнєЗакляттяСуперника = '';

			let кількістьМоїхАтак = 0;
			let кількістьМоїхЗахистів = 0;
			let кількістьМоїхЛікувань = 0;
			let кількістьМоїхМедитацій = 0;

			let кількістьСуперникаАтак = 0;
			let кількістьСуперникаЗахистів = 0;
			let кількістьСуперникаЛікувань = 0;
			let кількістьСуперникаМедитацій = 0;

			let рівеньМогоЖиття = 100;
			let рівеньМоєїМани = 100;
			let рівеньЖиттяСуперника = 100;
			let рівеньМаниСуперника = 100;

			for (let i = 0; i < 999; i++) {
				try {
					const my_option = eval(`()=>{ ${code} }`)();

					if (!options.includes(my_option)) {
						return false;
					}

					моєОстаннєЗакляття = my_option;

					const opponentOption = Math.floor(Math.random() * 4);
					останнєЗакляттяСуперника = options[opponentOption];

					switch (моєОстаннєЗакляття) {
						case 'атака':
							кількістьМоїхАтак++;
							break;
						case 'захист':
							кількістьМоїхЗахистів++;
							break;
						case 'лікування':
							кількістьМоїхЛікувань++;
							рівеньМогоЖиття += 10;
							break;
						case 'медитація':
							кількістьМоїхМедитацій++;
							рівеньМоєїМани += 10;
							break;
					}

					switch (останнєЗакляттяСуперника) {
						case 'атака':
							кількістьСуперникаАтак++;
							рівеньМогоЖиття -= 10;
							break;
						case 'захист':
							кількістьСуперникаЗахистів++;
							break;
						case 'лікування':
							кількістьСуперникаЛікувань++;
							рівеньЖиттяСуперника += 10;
							break;
						case 'медитація':
							кількістьСуперникаМедитацій++;
							рівеньМаниСуперника += 10;
							break;
					}

					if (рівеньМогоЖиття <= 0 || рівеньЖиттяСуперника <= 0) {
						return true;
					}
				} catch (error: any) {
					this._alert.error({
						unique: 'code',
						text: 'Помилка в коді: ' + error.message
					});

					return false;
				}
			}

			return true;
		},
		/**
		 * Validates "The Prisoner's Dilemma" strategy logic.
		 * Ensures choice is valid and simulates opponent decisions.
		 */
		"The Prisoner's Dilemma": (code: string): boolean => {
			const options = this.options["The Prisoner's Dilemma"];

			let мійОстаннійВибір = '';
			let останнійВибірСуперника = '';

			let кількістьМоїхЗрад = 0;
			let кількістьМоїхМовчань = 0;
			let кількістьЗрадСуперника = 0;
			let кількістьМовчаньСуперника = 0;

			for (let i = 0; i < 999; i++) {
				try {
					const my_option = eval(`()=>{ ${code} }`)();

					if (!options.includes(my_option)) {
						return false;
					}

					мійОстаннійВибір = my_option;

					const opponentOption = Math.floor(Math.random() * 2);
					останнійВибірСуперника = options[opponentOption];

					if (мійОстаннійВибір === 'зрадити') {
						кількістьМоїхЗрад++;
					} else {
						кількістьМоїхМовчань++;
					}

					if (останнійВибірСуперника === 'зрадити') {
						кількістьЗрадСуперника++;
					} else {
						кількістьМовчаньСуперника++;
					}
				} catch (error: any) {
					this._alert.error({
						unique: 'code',
						text: 'Помилка в коді: ' + error.message
					});
					return false;
				}
			}

			return true;
		}
	};

	runTournament(
		method: TournamentMethod,
		participations: Uacodetournamentparticipation[],
		query: object
	) {
		participations = participations.filter((participation) =>
			this.scriptLogicVerification[method](
				this._uacodeService.translate(participation.code)
			)
		);

		for (const participation of participations) {
			participation.points = 0;
		}

		if (!participations.length) {
			return;
		}

		const played: Record<string, true> = {};

		for (let i = 0; i < participations.length; i++) {
			for (let j = 0; j < participations.length; j++) {
				const _id =
					participations[i]._id > participations[j]._id
						? participations[i]._id + participations[j]._id
						: participations[j]._id + participations[i]._id;

				if (i !== j && !played[_id]) {
					played[_id] = true;

					this._run[method](participations[i], participations[j]);
				}
			}
		}

		this._http.post('/api/uacode/tournament/run', {
			...query,
			participations: participations.map((p) => {
				return {
					points: p.points,
					_id: p._id
				};
			})
		});
	}

	constructor(
		private _alert: AlertService,
		private _uacodeService: UacodeService
	) {}

	private _run = {
		'Rock, Paper, Scissors': (
			participantA: Uacodetournamentparticipation,
			participantB: Uacodetournamentparticipation,
			tags = []
		) => {
			const beats = {
				камінь: 'ножиці',
				ножиці: 'папір',
				папір: 'камінь'
			};

			const options = ['камінь', 'папір', 'ножиці'];

			const statsA = {
				myMove: '',
				opponentMove: '',
				myStones: 0,
				myPaper: 0,
				myScissors: 0,
				opponentStones: 0,
				opponentPaper: 0,
				opponentScissors: 0
			};

			const statsB = {
				myMove: '',
				opponentMove: '',
				myStones: 0,
				myPaper: 0,
				myScissors: 0,
				opponentStones: 0,
				opponentPaper: 0,
				opponentScissors: 0
			};

			for (let i = 0; i < 999; i++) {
				let moveA = this.getOptionRockPaperScissors(
					statsA.myMove,
					statsA.opponentMove,
					statsA.myStones,
					statsA.myPaper,
					statsA.myScissors,
					statsA.opponentStones,
					statsA.opponentPaper,
					statsA.opponentScissors,
					this._uacodeService.translate(participantA.code)
				) as 'камінь' | 'папір' | 'ножиці';

				let moveB = this.getOptionRockPaperScissors(
					statsB.myMove,
					statsB.opponentMove,
					statsB.myStones,
					statsB.myPaper,
					statsB.myScissors,
					statsB.opponentStones,
					statsB.opponentPaper,
					statsB.opponentScissors,
					this._uacodeService.translate(participantB.code)
				) as 'камінь' | 'папір' | 'ножиці';

				const data = this.applyTags(tags, options, moveA, moveB);

				moveA = data.moveA as 'камінь' | 'папір' | 'ножиці';

				moveB = data.moveB as 'камінь' | 'папір' | 'ножиці';

				if (!options.includes(moveA) || !options.includes(moveB))
					continue;

				statsA.myMove = moveA;
				statsA.opponentMove = moveB;
				statsB.myMove = moveB;
				statsB.opponentMove = moveA;

				switch (moveA) {
					case 'камінь':
						statsA.myStones++;
						statsB.opponentStones++;
						break;
					case 'папір':
						statsA.myPaper++;
						statsB.opponentPaper++;
						break;
					case 'ножиці':
						statsA.myScissors++;
						statsB.opponentScissors++;
						break;
				}
				switch (moveB) {
					case 'камінь':
						statsB.myStones++;
						statsA.opponentStones++;
						break;
					case 'папір':
						statsB.myPaper++;
						statsA.opponentPaper++;
						break;
					case 'ножиці':
						statsB.myScissors++;
						statsA.opponentScissors++;
						break;
				}

				if (moveA === moveB) continue;

				if (beats[moveA] === moveB) {
					participantA.points++;
				} else {
					participantB.points++;
				}
			}
		},
		Magicians: (
			participantA: Uacodetournamentparticipation,
			participantB: Uacodetournamentparticipation,
			tags = []
		) => {
			const options = ['атака', 'захист', 'лікування', 'медитація'];

			const statsA: any = {
				previousMove: '',
				health: 100,
				mana: 100,
				атака: 0,
				захист: 0,
				лікування: 0,
				медитація: 0
			};

			const statsB: any = {
				previousMove: '',
				health: 100,
				mana: 100,
				атака: 0,
				захист: 0,
				лікування: 0,
				медитація: 0
			};

			for (let i = 0; i < 999; i++) {
				let moveA = this.getOptionMagicians(
					statsA.previousMove,
					statsB.previousMove,
					statsA.атака,
					statsA.захист,
					statsA.лікування,
					statsA.медитація,
					statsB.атака,
					statsB.захист,
					statsB.лікування,
					statsB.медитація,
					statsA.health,
					statsA.mana,
					statsB.health,
					statsB.mana,
					this._uacodeService.translate(participantA.code)
				) as '' | 'атака' | 'захист' | 'лікування' | 'медитація';

				let moveB = this.getOptionMagicians(
					statsB.previousMove,
					statsA.previousMove,
					statsB.атака,
					statsB.захист,
					statsB.лікування,
					statsB.медитація,
					statsA.атака,
					statsA.захист,
					statsA.лікування,
					statsA.медитація,
					statsB.health,
					statsB.mana,
					statsA.health,
					statsA.mana,
					this._uacodeService.translate(participantB.code)
				) as '' | 'атака' | 'захист' | 'лікування' | 'медитація';

				const data = this.applyTags(tags, options, moveA, moveB);

				moveA = data.moveA as
					| ''
					| 'атака'
					| 'захист'
					| 'лікування'
					| 'медитація';

				moveB = data.moveB as
					| ''
					| 'атака'
					| 'захист'
					| 'лікування'
					| 'медитація';

				if (!options.includes(moveA) || !options.includes(moveB))
					continue;

				statsA.previousMove = moveA;
				statsB.previousMove = moveB;

				statsA[moveA]++;
				statsB[moveB]++;

				if (
					(moveA === 'атака' && statsA.mana < 30) ||
					(moveA === 'захист' && statsA.mana < 10) ||
					(moveA === 'лікування' && statsA.mana < 10)
				) {
					moveA = '';
				}
				if (
					(moveB === 'атака' && statsB.mana < 30) ||
					(moveB === 'захист' && statsB.mana < 10) ||
					(moveB === 'лікування' && statsB.mana < 10)
				) {
					moveB = '';
				}

				this.magicianFight(moveA, moveB, statsA, statsB);
				this.magicianFight(moveB, moveA, statsB, statsA);

				if (statsA.health <= 0 && statsB.health <= 0) break;
				else if (statsA.health <= 0) participantA.points++;
				else if (statsB.health <= 0) participantB.points++;
			}
		},
		"The Prisoner's Dilemma": (
			participantA: Uacodetournamentparticipation,
			participantB: Uacodetournamentparticipation,
			tags = []
		) => {
			const options = ['зрадити', 'мовчати'];

			let statsA: any = {
				previousMove: '',
				зрадити: 0,
				мовчати: 0
			};

			let statsB: any = {
				previousMove: '',
				зрадити: 0,
				мовчати: 0
			};

			for (let i = 0; i < 999; i++) {
				let moveA = this.getOptionThePrisonersDilemma(
					statsA.previousMove,
					statsB.previousMove,
					statsA.зрадити,
					statsA.мовчати,
					statsB.зрадити,
					statsB.мовчати,
					this._uacodeService.translate(participantA.code)
				);

				let moveB = this.getOptionThePrisonersDilemma(
					statsB.previousMove,
					statsA.previousMove,
					statsB.зрадити,
					statsB.мовчати,
					statsA.зрадити,
					statsA.мовчати,
					this._uacodeService.translate(participantB.code)
				);

				const data = this.applyTags(tags, options, moveA, moveB);

				moveA = data.moveA;

				moveB = data.moveB;

				if (!options.includes(moveA) || !options.includes(moveB))
					continue;

				statsA.previousMove = moveA;
				statsB.previousMove = moveB;

				statsA[moveA]++;
				statsB[moveB]++;

				// нарахування очок
				if (moveA === 'мовчати' && moveB === 'мовчати') {
					participantA.points += 3;
					participantB.points += 3;
				} else if (moveA === 'мовчати' && moveB === 'зрадити') {
					participantB.points += 5;
				} else if (moveA === 'зрадити' && moveB === 'мовчати') {
					participantA.points += 5;
				} else {
					participantA.points += 1;
					participantB.points += 1;
				}
			}
		}
	};

	getOptionRockPaperScissors(
		мійОстаннійХід: any,
		суперникаОстаннійХід: any,
		кількістьМоїхКаменів: any,
		кількістьМоїхПаперів: any,
		кількістьМоїхНожиців: any,
		кількістьСуперникаКаменів: any,
		кількістьСуперникаПаперів: any,
		кількістьСуперникаНожиців: any,
		code: any
	) {
		try {
			return eval(`()=>{ ${code} }`)();
		} catch (e) {
			return null;
		}
	}

	getOptionMagicians(
		моєОстаннєЗакляття: any,
		останнєЗакляттяСуперника: any,
		кількістьМоїхАтак: any,
		кількістьМоїхЗахистів: any,
		кількістьМоїхЛікувань: any,
		кількістьМоїхМедитацій: any,
		кількістьСуперникаАтак: any,
		кількістьСуперникаЗахистів: any,
		кількістьСуперникаЛікувань: any,
		кількістьСуперникаМедитацій: any,
		рівеньМогоЖиття: any,
		рівеньМоєїМани: any,
		рівеньЖиттяСуперника: any,
		рівеньМаниСуперника: any,
		code: any
	) {
		try {
			return eval(`()=>{ ${code} }`)();
		} catch (e) {
			return null;
		}
	}

	getOptionThePrisonersDilemma(
		мійОстаннійВибір: any,
		останнійВибірСуперника: any,
		кількістьМоїхЗрад: any,
		кількістьМоїхМовчань: any,
		кількістьЗрадСуперника: any,
		кількістьМовчаньСуперника: any,
		code: any
	) {
		try {
			return eval(`()=>{ ${code} }`)();
		} catch (e) {
			return null;
		}
	}

	applyTags(tags: any, options: any, moveA: any, moveB: any) {
		if (tags.includes('Reality') && Math.random() < 0.04) {
			moveA = options[Math.floor(Math.random() * options.length)];
		}

		if (tags.includes('Reality') && Math.random() < 0.04) {
			moveB = options[Math.floor(Math.random() * options.length)];
		}

		if (tags.includes('One Shift')) {
			if (Math.random() > 0.5) {
				moveA =
					options[options.length - 1] === moveA
						? options[0]
						: options[options.indexOf(moveA) + 1];
			} else {
				moveB =
					options[options.length - 1] === moveB
						? options[0]
						: options[options.indexOf(moveB) + 1];
			}
		}

		return {
			moveA,
			moveB
		};
	}

	magicianFight = (a: any, b: any, sA: any, sB: any) => {
		if (a === 'атака') {
			sB.health -= b === 'захист' ? 10 : 30;

			sA.mana -= 30;
		}

		if (a === 'захист') sA.mana -= 10;

		if (a === 'лікування') {
			sA.health += 20;

			if (sA.health > 100) sA.health = 100;

			sA.mana -= 10;
		}

		if (a === 'медитація') sA.mana += 50;
	};
}
