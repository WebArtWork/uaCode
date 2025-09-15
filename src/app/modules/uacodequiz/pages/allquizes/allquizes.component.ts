import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { AlertService, CoreService } from 'wacom';
import { uacodequizFormComponents } from '../../formcomponents/uacodequiz.formcomponents';
import { Uacodequiz } from '../../interfaces/uacodequiz.interface';
import { UacodequizService } from '../../services/uacodequiz.service';

@Component({
	templateUrl: './allquizes.component.html',
	styleUrls: ['./allquizes.component.scss'],
	standalone: false
})
export class AllquizesComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm(
		'uacodequiz',
		uacodequizFormComponents
	);

	config = {
		paginate: this.setRows.bind(this),
		perPage: 20,
		setPerPage: this._uacodequizService.setPerPage.bind(
			this._uacodequizService
		),
		allDocs: false,
		create: (): void => {
			this._form.modal<Uacodequiz>(this.form, {
				label: 'Create',
				click: async (created: unknown, close: () => void) => {
					close();

					this._preCreate(created as Uacodequiz);

					await firstValueFrom(
						this._uacodequizService.create(created as Uacodequiz)
					);

					this.setRows();
				}
			});
		},
		update: (doc: Uacodequiz): void => {
			this._form
				.modal<Uacodequiz>(this.form, [], doc)
				.then((updated: Uacodequiz) => {
					this._core.copy(updated, doc);

					this._uacodequizService.update(doc);
				});
		},
		delete: (doc: Uacodequiz): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this uacodequiz?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: async (): Promise<void> => {
							await firstValueFrom(
								this._uacodequizService.delete(doc)
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
				click: (doc: Uacodequiz): void => {
					this._form.modalUnique<Uacodequiz>(
						'uacodequiz',
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

	rows: Uacodequiz[] = [];

	constructor(
		private _translate: TranslateService,
		private _uacodequizService: UacodequizService,
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
				this._uacodequizService.get({ page }).subscribe((rows) => {
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
				.modalDocs<Uacodequiz>(create ? [] : this.rows)
				.then(async (uacodequizs: Uacodequiz[]) => {
					if (create) {
						for (const uacodequiz of uacodequizs) {
							this._preCreate(uacodequiz);

							await firstValueFrom(
								this._uacodequizService.create(uacodequiz)
							);
						}
					} else {
						for (const uacodequiz of this.rows) {
							if (
								!uacodequizs.find(
									(localUacodequiz) =>
										localUacodequiz._id === uacodequiz._id
								)
							) {
								await firstValueFrom(
									this._uacodequizService.delete(uacodequiz)
								);
							}
						}

						for (const uacodequiz of uacodequizs) {
							const localUacodequiz = this.rows.find(
								(localUacodequiz) =>
									localUacodequiz._id === uacodequiz._id
							);

							if (localUacodequiz) {
								this._core.copy(uacodequiz, localUacodequiz);

								await firstValueFrom(
									this._uacodequizService.update(
										localUacodequiz
									)
								);
							} else {
								this._preCreate(uacodequiz);

								await firstValueFrom(
									this._uacodequizService.create(uacodequiz)
								);
							}
						}
					}

					this.setRows();
				});
		};
	}

	private _preCreate(uacodequiz: Uacodequiz): void {
		delete uacodequiz.__created;
	}
}
