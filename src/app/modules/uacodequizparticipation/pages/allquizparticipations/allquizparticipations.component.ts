import { Component } from '@angular/core';
import { AlertService, CoreService } from 'wacom';
import { UacodequizparticipationService } from '../../services/uacodequizparticipation.service';
import { Uacodequizparticipation } from '../../interfaces/uacodequizparticipation.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { uacodequizparticipationFormComponents } from '../../formcomponents/uacodequizparticipation.formcomponents';
import { firstValueFrom } from 'rxjs';

@Component({
	templateUrl: './allquizparticipations.component.html',
	styleUrls: ['./allquizparticipations.component.scss'],
	standalone: false,
})
export class AllquizparticipationsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('uacodequizparticipation', uacodequizparticipationFormComponents);

	config = {
		paginate: this.setRows.bind(this),
		perPage: 20,
		setPerPage: this._uacodequizparticipationService.setPerPage.bind(this._uacodequizparticipationService),
		allDocs: false,
		create: (): void => {
			this._form.modal<Uacodequizparticipation>(this.form, {
				label: 'Create',
				click: async (created: unknown, close: () => void) => {
					close();

					this._preCreate(created as Uacodequizparticipation);

					await firstValueFrom(
						this._uacodequizparticipationService.create(created as Uacodequizparticipation)
					);

					this.setRows();
				},
			});
		},
		update: (doc: Uacodequizparticipation): void => {
			this._form
				.modal<Uacodequizparticipation>(this.form, [], doc)
				.then((updated: Uacodequizparticipation) => {
					this._core.copy(updated, doc);

					this._uacodequizparticipationService.update(doc);
				});
		},
		delete: (doc: Uacodequizparticipation): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this uacodequizparticipation?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No'),
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: async (): Promise<void> => {
							await firstValueFrom(this._uacodequizparticipationService.delete(doc));

							this.setRows();
						},
					},
				],
			});
		},
		buttons: [
			{
				icon: 'cloud_download',
				click: (doc: Uacodequizparticipation): void => {
					this._form.modalUnique<Uacodequizparticipation>('uacodequizparticipation', 'url', doc);
				},
			},
		],
		headerButtons: [
			{
				icon: 'playlist_add',
				click: this._bulkManagement(),
				class: 'playlist',
			},
			{
				icon: 'edit_note',
				click: this._bulkManagement(false),
				class: 'edit',
			},
		],
	};

	rows: Uacodequizparticipation[] = [];

	constructor(
		private _translate: TranslateService,
		private _uacodequizparticipationService: UacodequizparticipationService,
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
				this._uacodequizparticipationService.get({ page }).subscribe((rows) => {
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
				.modalDocs<Uacodequizparticipation>(create ? [] : this.rows)
				.then(async (uacodequizparticipations: Uacodequizparticipation[]) => {
					if (create) {
						for (const uacodequizparticipation of uacodequizparticipations) {
							this._preCreate(uacodequizparticipation);

							await firstValueFrom(
								this._uacodequizparticipationService.create(uacodequizparticipation)
							);
						}
					} else {
						for (const uacodequizparticipation of this.rows) {
							if (
								!uacodequizparticipations.find(
									(localUacodequizparticipation) => localUacodequizparticipation._id === uacodequizparticipation._id
								)
							) {
								await firstValueFrom(
									this._uacodequizparticipationService.delete(uacodequizparticipation)
								);
							}
						}

						for (const uacodequizparticipation of uacodequizparticipations) {
							const localUacodequizparticipation = this.rows.find(
								(localUacodequizparticipation) => localUacodequizparticipation._id === uacodequizparticipation._id
							);

							if (localUacodequizparticipation) {
								this._core.copy(uacodequizparticipation, localUacodequizparticipation);

								await firstValueFrom(
									this._uacodequizparticipationService.update(localUacodequizparticipation)
								);
							} else {
								this._preCreate(uacodequizparticipation);

								await firstValueFrom(
									this._uacodequizparticipationService.create(uacodequizparticipation)
								);
							}
						}
					}

					this.setRows();
				});
		};
	}

	private _preCreate(uacodequizparticipation: Uacodequizparticipation): void {
		delete uacodequizparticipation.__created;
	}
}
