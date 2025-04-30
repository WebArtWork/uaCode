import { Injectable } from '@angular/core';
import { Uacodetournament } from '../interfaces/uacodetournament.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodetournamentService extends CrudService<Uacodetournament> {
	methods = ['Rock, Paper, Scissors'];

	options = {
		'Rock, Paper, Scissors': ['камінь', 'папір', 'ножиці']
	};

	test = {
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

			for (let i = 0; i < 99999; i++) {
				const my_option = eval(code);

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
			}

			return true;
		}
	};

	constructor() {
		super({
			name: 'uacodetournament'
		});
	}
}
