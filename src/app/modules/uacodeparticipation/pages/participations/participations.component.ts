import { Component } from '@angular/core';
import { AlertService, CoreService } from 'wacom';
import { UacodeparticipationService } from '../../services/uacodeparticipation.service';
import { Uacodeparticipation } from '../../interfaces/uacodeparticipation.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { uacodeparticipationFormComponents } from '../../formcomponents/uacodeparticipation.formcomponents';
import { firstValueFrom } from 'rxjs';

@Component({
	templateUrl: './participations.component.html',
	styleUrls: ['./participations.component.scss'],
	standalone: false,
})
export class ParticipationsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('uacodeparticipation', uacodeparticipationFormComponents);

	config = {
		paginate: this.setRows.bind(this),
		perPage: 20,
		setPerPage: this._uacodeparticipationService.setPerPage.bind(this._uacodeparticipationService),
		allDocs: false,
		create: (): void => {
			this._form.modal<Uacodeparticipation>(this.form, {
				label: 'Create',
				click: async (created: unknown, close: () => void) => {
					close();

					this._preCreate(created as Uacodeparticipation);

					await firstValueFrom(
						this._uacodeparticipationService.create(created as Uacodeparticipation)
					);

					this.setRows();
				},
			});
		},
		update: (doc: Uacodeparticipation): void => {
			this._form
				.modal<Uacodeparticipation>(this.form, [], doc)
				.then((updated: Uacodeparticipation) => {
					this._core.copy(updated, doc);

					this._uacodeparticipationService.update(doc);
				});
		},
		delete: (doc: Uacodeparticipation): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this uacodeparticipation?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No'),
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: async (): Promise<void> => {
							await firstValueFrom(this._uacodeparticipationService.delete(doc));

							this.setRows();
						},
					},
				],
			});
		},
		buttons: [
			{
				icon: 'cloud_download',
				click: (doc: Uacodeparticipation): void => {
					this._form.modalUnique<Uacodeparticipation>('uacodeparticipation', 'url', doc);
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

	rows: Uacodeparticipation[] = [];

	constructor(
		private _translate: TranslateService,
		private _uacodeparticipationService: UacodeparticipationService,
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
				this._uacodeparticipationService.get({ page }).subscribe((rows) => {
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
				.modalDocs<Uacodeparticipation>(create ? [] : this.rows)
				.then(async (uacodeparticipations: Uacodeparticipation[]) => {
					if (create) {
						for (const uacodeparticipation of uacodeparticipations) {
							this._preCreate(uacodeparticipation);

							await firstValueFrom(
								this._uacodeparticipationService.create(uacodeparticipation)
							);
						}
					} else {
						for (const uacodeparticipation of this.rows) {
							if (
								!uacodeparticipations.find(
									(localUacodeparticipation) => localUacodeparticipation._id === uacodeparticipation._id
								)
							) {
								await firstValueFrom(
									this._uacodeparticipationService.delete(uacodeparticipation)
								);
							}
						}

						for (const uacodeparticipation of uacodeparticipations) {
							const localUacodeparticipation = this.rows.find(
								(localUacodeparticipation) => localUacodeparticipation._id === uacodeparticipation._id
							);

							if (localUacodeparticipation) {
								this._core.copy(uacodeparticipation, localUacodeparticipation);

								await firstValueFrom(
									this._uacodeparticipationService.update(localUacodeparticipation)
								);
							} else {
								this._preCreate(uacodeparticipation);

								await firstValueFrom(
									this._uacodeparticipationService.create(uacodeparticipation)
								);
							}
						}
					}

					this.setRows();
				});
		};
	}

	private _preCreate(uacodeparticipation: Uacodeparticipation): void {
		delete uacodeparticipation.__created;
	}
}
