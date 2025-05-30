import { Injectable } from '@angular/core';
import { Uacodetournamentparticipation } from '../interfaces/uacodetournamentparticipation.interface';
import { AlertService, CrudService } from 'wacom';

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
