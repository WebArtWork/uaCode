import { Injectable } from '@angular/core';
import { Uacodeclass } from '../interfaces/uacodeclass.interface';
import { CoreService, CrudService, StoreService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodeclassService extends CrudService<Uacodeclass> {
	classId: string;

	constructor(
		private _core: CoreService,
		private _store: StoreService
	) {
		super({
			name: 'uacodeclass'
		});

		this.get({
			query: 'device=' + this._core.deviceID
		});

		this._store.get('uacodeclassId', (classId) => {
			if (classId) {
				this.classId = classId;
			}
		});
	}
}
