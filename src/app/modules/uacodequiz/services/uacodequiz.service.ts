import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { Uacodequiz } from '../interfaces/uacodequiz.interface';

@Injectable({
	providedIn: 'root'
})
export class UacodequizService extends CrudService<Uacodequiz> {
	constructor() {
		super({
			name: 'uacodequiz'
		});
	}
}
