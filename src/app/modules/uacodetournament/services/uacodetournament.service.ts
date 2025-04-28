import { Injectable } from '@angular/core';
import { Uacodetournament } from '../interfaces/uacodetournament.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root',
})
export class UacodetournamentService extends CrudService<Uacodetournament> {
	constructor() {
		super({
			name: 'uacodetournament',
		});
	}
}
