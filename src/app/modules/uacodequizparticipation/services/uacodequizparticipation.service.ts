import { Injectable } from '@angular/core';
import { Uacodequizparticipation } from '../interfaces/uacodequizparticipation.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root',
})
export class UacodequizparticipationService extends CrudService<Uacodequizparticipation> {
	constructor() {
		super({
			name: 'uacodequizparticipation',
		});
	}
}
