import { Injectable } from '@angular/core';
import { AlertService, CrudService } from 'wacom';
import { Uacodetournamentparticipation } from '../interfaces/uacodetournamentparticipation.interface';

@Injectable({
	providedIn: 'root'
})
export class UacodetournamentparticipationService extends CrudService<Uacodetournamentparticipation> {
	constructor(private _alert: AlertService) {
		super({
			name: 'uacodetournamentparticipation'
		});
	}
}
