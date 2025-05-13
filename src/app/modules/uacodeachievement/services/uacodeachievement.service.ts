import { Injectable } from '@angular/core';
import { Uacodeachievement } from '../interfaces/uacodeachievement.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root',
})
export class UacodeachievementService extends CrudService<Uacodeachievement> {
	constructor() {
		super({
			name: 'uacodeachievement',
		});
	}
}
