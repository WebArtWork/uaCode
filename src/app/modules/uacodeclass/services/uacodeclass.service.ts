import { Injectable } from '@angular/core';
import { Uacodeclass } from '../interfaces/uacodeclass.interface';
import { CoreService, CrudService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodeclassService extends CrudService<Uacodeclass> {
	constructor(private _core: CoreService) {
		super({
			name: 'uacodeclass'
		});

		this.get({
			query: 'device=' + this._core.deviceID
		});
	}
}
