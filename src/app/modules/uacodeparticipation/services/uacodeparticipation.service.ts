import { Injectable } from '@angular/core';
import { Uacodeparticipation } from '../interfaces/uacodeparticipation.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodeparticipationService extends CrudService<Uacodeparticipation> {
	constructor() {
		super({
			name: 'uacodeparticipation'
		});
	}
}
