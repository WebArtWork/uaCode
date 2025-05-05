import { Injectable } from '@angular/core';
import { Uacodequiz } from '../interfaces/uacodequiz.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root',
})
export class UacodequizService extends CrudService<Uacodequiz> {
	constructor() {
		super({
			name: 'uacodequiz',
		});
	}
}
