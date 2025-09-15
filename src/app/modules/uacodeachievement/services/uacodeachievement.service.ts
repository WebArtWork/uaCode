import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { Uacodeachievement } from '../interfaces/uacodeachievement.interface';

@Injectable({
	providedIn: 'root'
})
export class UacodeachievementService extends CrudService<Uacodeachievement> {
	constructor() {
		super({
			name: 'uacodeachievement'
		});
	}
}
