import { Injectable } from '@angular/core';
import { Uacodeclass } from '../interfaces/uacodeclass.interface';
import { CrudService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodeclassService extends CrudService<Uacodeclass> {
	constructor() {
		super({
			name: 'uacodeclass'
		});
	}
}
