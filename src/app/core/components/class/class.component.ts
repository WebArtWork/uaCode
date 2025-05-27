import {
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
export class ClassComponent {
	@Output() wChange = new EventEmitter();

	class: Uacodeclass;

	loaded = false;

	constructor(
		public classService: UacodeclassService,
		private _store: StoreService,
		private _http: HttpService,
		private _core: CoreService,
		private _form: FormService,
		private _cdr: ChangeDetectorRef
	) {
		this._core.onComplete('class').then(() => {
			this.class = this.classService.classes?.find(
				(c) => c._id === this.classService.classId
			) as Uacodeclass;

			if (!this.class) {
				this.classService.classId = '';
			}

			this.wChange.emit(this.classService.classId);

			this._mine();

			this.loaded = true;

			this._cdr.detectChanges();
		});
	}

	setClass(id: string) {
		this.classService.classId = id;

		this.class = this.classService.classes.find(
			(c) => c._id === id
		) as Uacodeclass;

		this._store.set('uacodeclassId', id);

		this.wChange.emit(id);

		this._mine();
	}

	create() {
		this._form.modal<Uacodeclass>(this._classCreationForm, {
			label: 'Створити',
			click: async (classDocument: unknown, close: () => void) => {
				close();

				this.classService
					.create({
						...(classDocument as Uacodeclass),
						device: this._core.deviceID
					})
					.subscribe((created) => {
						this.setClass(created._id);
					});
			}
		});
	}

	join() {
		this._form.modal<Uacodeclass>(this._classJoinForm, {
			label: 'Приєднатися',
			click: async (classDocument: unknown, close: () => void) => {
				close();

				this.classService
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
										this.classService.classes.push(
											classDocument
										);

										this.setClass(classDocument._id);
									}
								});
						}
					});
			}
		});
	}

	private _mine() {
		if (this.classService.classId && this.classService.classes) {
			const classDocument = this.classService.classes.find(
				(c) => c._id === this.classService.classId
			);

			if (classDocument) {
				this.classService.mineClass =
					classDocument.device === this._core.deviceID;
			} else {
				this.classService.classId = '';
			}
		}
	}

	private _classCreationForm: FormInterface = this._form.getForm(
		'classCreationForm',
		{
			formId: 'classCreationForm',
			title: 'Створення групи',
			components: [
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: "Введіть ім'я"
						},
						{
							name: 'Label',
							value: "Ім'я"
						}
					]
				},
				{
					name: 'Text',
					key: 'description',
					fields: [
						{
							name: 'Placeholder',
							value: 'Введіть опис'
						},
						{
							name: 'Label',
							value: 'Опис'
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
			title: 'Приєднатися до групи',
			components: [
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: "Введіть ім'я"
						},
						{
							name: 'Label',
							value: "Ім'я"
						}
					]
				},
				{
					name: 'Number',
					key: 'code',
					fields: [
						{
							name: 'Placeholder',
							value: 'Введіть опис'
						},
						{
							name: 'Label',
							value: 'Опис'
						}
					]
				}
			]
		}
	);
}
