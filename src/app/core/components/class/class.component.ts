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

	classes: Uacodeclass[] = [];

	classId: string;

	loaded = false;

	constructor(
		private _classService: UacodeclassService,
		private _store: StoreService,
		private _http: HttpService,
		private _core: CoreService,
		private _form: FormService,
		private _cdr: ChangeDetectorRef
	) {}

	ngAfterViewInit(): void {
		this._store.get('uacodeclassId', (classId) => {
			if (classId) {
				this.classId = classId;

				this.wChange.emit(classId);
			}

			this._load();
		});
	}

	setClass(id: string) {
		this._store.set('uacodeclassId', id);

		this.wChange.emit(id);
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
									}
								});
						}
					});
			}
		});
	}

	private _load() {
		this._classService
			.get({
				query: 'device=' + this._core.deviceID
			})
			.subscribe((classes) => {
				this.classes = classes;

				this.loaded = true;

				this._cdr.detectChanges();
			});
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
