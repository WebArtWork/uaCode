import { Injectable } from '@angular/core';
import { Uacodeclass } from '../interfaces/uacodeclass.interface';
import { CoreService, CrudService, StoreService } from 'wacom';

@Injectable({
	providedIn: 'root'
})
export class UacodeclassService extends CrudService<Uacodeclass> {
	classes: Uacodeclass[];

	classId: string;

	mineClass = false;

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

			this._core.onComplete('uacodeclass_loaded').then(() => {
				this.classes = this.getDocs();

				this._core.complete('class');

				this.mineClass =
					this.classes.find((c) => c._id === this.classId)?.device ===
					this._core.deviceID;
			});
		});
	}
}
