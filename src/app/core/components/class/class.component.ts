import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Output
} from '@angular/core';
import { Uacodeclass } from 'src/app/modules/uacodeclass/interfaces/uacodeclass.interface';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { FormService } from '../../modules/form/form.service';
import { FormInterface } from '../../modules/form/interfaces/form.interface';
import { CoreService, HttpService, StoreService } from 'wacom';

@Component({
	selector: 'core-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.scss'],
	standalone: false
})
export class ClassComponent implements AfterViewInit {
	@Output() wChange = new EventEmitter();

	@Output() mine = new EventEmitter();

	classes: Uacodeclass[] = [];

	class: Uacodeclass;

	classId: string;

	loaded = false;

	isMine = false;

	constructor(
		private _classService: UacodeclassService,
		private _store: StoreService,
		private _http: HttpService,
		private _core: CoreService,
		private _form: FormService,
		private _cdr: ChangeDetectorRef
	) {
		this._load();
	}

	ngAfterViewInit(): void {
		this._store.get('uacodeclassId', (classId) => {
			if (classId) {
				this.classId = classId;

				this.class = this.classes.find(
					(c) => c._id === classId
				) as Uacodeclass;

				this.wChange.emit(classId);

				this._mine();
			}
		});
	}

	setClass(id: string) {
		this.classId = id;

		this.class = this.classes.find((c) => c._id === id) as Uacodeclass;

		this._store.set('uacodeclassId', id);

		this.wChange.emit(id);

		this._mine();
	}

	create() {
		this._form.modal<Uacodeclass>(this._classCreationForm, {
			label: 'Create',
			click: async (classDocument: unknown, close: () => void) => {
				close();

				this._classService
					.create({
						...(classDocument as Uacodeclass),
						device: this._core.deviceID
					})
					.subscribe((created) => {
						this.classes.push(created);

						this.class = this.classes.find(
							(c) => c._id === this.classId
						) as Uacodeclass;
					});
			}
		});
	}

	join() {
		this._form.modal<Uacodeclass>(this._classJoinForm, {
			label: 'Join',
			click: async (classDocument: unknown, close: () => void) => {
				close();

				this._classService
					.fetch(classDocument as Uacodeclass)
					.subscribe((hasAccess) => {
						if (hasAccess) {
							this._http
								.post('/api/uacode/class/join', {
									...(classDocument as Uacodeclass),
									device: this._core.deviceID
								})
								.subscribe((classDocument: Uacodeclass) => {
									if (classDocument) {
										this.classes.push(classDocument);

										this.setClass(classDocument._id);
									}
								});
						}
					});
			}
		});
	}

	private _load() {
		this._core.onComplete('uacodeclass_loaded').then(() => {
			this.classes = this._classService.getDocs();

			this.class = this.classes.find(
				(c) => c._id === this.classId
			) as Uacodeclass;

			this._mine();

			this.loaded = true;

			this._cdr.detectChanges();
		});
	}

	private _mine() {
		if (this.classId) {
			const classDocument = this.classes.find(
				(c) => c._id === this.classId
			);

			if (classDocument) {
				this.isMine = classDocument.device === this._core.deviceID;

				this.mine.emit(classDocument.device === this._core.deviceID);
			}
		}
	}

	private _classCreationForm: FormInterface = this._form.getForm(
		'classCreationForm',
		{
			formId: 'classCreationForm',
			title: 'Class creation',
			components: [
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: 'Enter name'
						},
						{
							name: 'Label',
							value: 'Name'
						}
					]
				},
				{
					name: 'Text',
					key: 'description',
					fields: [
						{
							name: 'Placeholder',
							value: 'Enter description'
						},
						{
							name: 'Label',
							value: 'Description'
						}
					]
				}
			]
		}
	);

	private _classJoinForm: FormInterface = this._form.getForm(
		'classJoinForm',
		{
			formId: 'classJoinForm',
			title: 'Join class',
			components: [
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: 'Enter name'
						},
						{
							name: 'Label',
							value: 'Name'
						}
					]
				},
				{
					name: 'Number',
					key: 'code',
					fields: [
						{
							name: 'Placeholder',
							value: 'Enter description'
						},
						{
							name: 'Label',
							value: 'Description'
						}
					]
				}
			]
		}
	);
}
