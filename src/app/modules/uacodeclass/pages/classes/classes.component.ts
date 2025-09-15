import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { AlertService, CoreService } from 'wacom';
import { uacodeclassFormComponents } from '../../formcomponents/uacodeclass.formcomponents';
import { Uacodeclass } from '../../interfaces/uacodeclass.interface';
import { UacodeclassService } from '../../services/uacodeclass.service';

@Component({
	templateUrl: './classes.component.html',
	styleUrls: ['./classes.component.scss'],
	standalone: false
})
export class ClassesComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm(
		'uacodeclass',
		uacodeclassFormComponents
	);

	config = {
		paginate: this.setRows.bind(this),
		perPage: 20,
		setPerPage: this._uacodeclassService.setPerPage.bind(
			this._uacodeclassService
		),
		allDocs: false,
		create: (): void => {
			this._form.modal<Uacodeclass>(this.form, {
				label: 'Create',
				click: async (created: unknown, close: () => void) => {
					close();

					this._preCreate(created as Uacodeclass);

					await firstValueFrom(
						this._uacodeclassService.create(created as Uacodeclass)
					);

					this.setRows();
				}
			});
		},
		update: (doc: Uacodeclass): void => {
			this._form
				.modal<Uacodeclass>(this.form, [], doc)
				.then((updated: Uacodeclass) => {
					this._core.copy(updated, doc);

					this._uacodeclassService.update(doc);
				});
		},
		delete: (doc: Uacodeclass): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this uacodeclass?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: async (): Promise<void> => {
							await firstValueFrom(
								this._uacodeclassService.delete(doc)
							);

							this.setRows();
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'cloud_download',
				click: (doc: Uacodeclass): void => {
					this._form.modalUnique<Uacodeclass>(
						'uacodeclass',
						'url',
						doc
					);
				}
			}
		],
		headerButtons: [
			{
				icon: 'playlist_add',
				click: this._bulkManagement(),
				class: 'playlist'
			},
			{
				icon: 'edit_note',
				click: this._bulkManagement(false),
				class: 'edit'
			}
		]
	};

	rows: Uacodeclass[] = [];

	constructor(
		private _translate: TranslateService,
		private _uacodeclassService: UacodeclassService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService
	) {
		this.setRows();
	}

	setRows(page = this._page): void {
		this._page = page;

		this._core.afterWhile(
			this,
			() => {
				this._uacodeclassService.get({ page }).subscribe((rows) => {
					this.rows.splice(0, this.rows.length);

					this.rows.push(...rows);
				});
			},
			250
		);
	}

	private _page = 1;

	private _bulkManagement(create = true): () => void {
		return (): void => {
			this._form
				.modalDocs<Uacodeclass>(create ? [] : this.rows)
				.then(async (uacodeclasss: Uacodeclass[]) => {
					if (create) {
						for (const uacodeclass of uacodeclasss) {
							this._preCreate(uacodeclass);

							await firstValueFrom(
								this._uacodeclassService.create(uacodeclass)
							);
						}
					} else {
						for (const uacodeclass of this.rows) {
							if (
								!uacodeclasss.find(
									(localUacodeclass) =>
										localUacodeclass._id === uacodeclass._id
								)
							) {
								await firstValueFrom(
									this._uacodeclassService.delete(uacodeclass)
								);
							}
						}

						for (const uacodeclass of uacodeclasss) {
							const localUacodeclass = this.rows.find(
								(localUacodeclass) =>
									localUacodeclass._id === uacodeclass._id
							);

							if (localUacodeclass) {
								this._core.copy(uacodeclass, localUacodeclass);

								await firstValueFrom(
									this._uacodeclassService.update(
										localUacodeclass
									)
								);
							} else {
								this._preCreate(uacodeclass);

								await firstValueFrom(
									this._uacodeclassService.create(uacodeclass)
								);
							}
						}
					}

					this.setRows();
				});
		};
	}

	private _preCreate(uacodeclass: Uacodeclass): void {
		delete uacodeclass.__created;
	}
}
