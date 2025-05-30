import { Injectable } from '@angular/core';
import { AlertService } from 'wacom';

/**
 * TournamentService handles game configuration, option validation,
 * and logic verification for tournament games.
 */
@Injectable({
	providedIn: 'root'
})
export class TournamentService {
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

	constructor(private _alert: AlertService) {}
}
