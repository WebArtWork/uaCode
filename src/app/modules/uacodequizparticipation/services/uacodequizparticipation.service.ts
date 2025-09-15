import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { Uacodequizparticipation } from '../interfaces/uacodequizparticipation.interface';

@Injectable({
	providedIn: 'root'
})
export class UacodequizparticipationService extends CrudService<Uacodequizparticipation> {
	constructor() {
		super({
			name: 'uacodequizparticipation'
		});
	}
}
