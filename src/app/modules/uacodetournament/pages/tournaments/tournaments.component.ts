import { Component } from '@angular/core';
import { AlertService, CoreService } from 'wacom';
import { UacodetournamentService } from '../../services/uacodetournament.service';
import { Uacodetournament } from '../../interfaces/uacodetournament.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { uacodetournamentFormComponents } from '../../formcomponents/uacodetournament.formcomponents';
import { firstValueFrom } from 'rxjs';

@Component({
	templateUrl: './tournaments.component.html',
	styleUrls: ['./tournaments.component.scss'],
	standalone: false,
})
export class TournamentsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('uacodetournament', uacodetournamentFormComponents);

	config = {
		paginate: this.setRows.bind(this),
		perPage: 20,
		setPerPage: this._uacodetournamentService.setPerPage.bind(this._uacodetournamentService),
		allDocs: false,
		create: (): void => {
			this._form.modal<Uacodetournament>(this.form, {
				label: 'Create',
				click: async (created: unknown, close: () => void) => {
					close();

					this._preCreate(created as Uacodetournament);

					await firstValueFrom(
						this._uacodetournamentService.create(created as Uacodetournament)
					);

					this.setRows();
				},
			});
		},
		update: (doc: Uacodetournament): void => {
			this._form
				.modal<Uacodetournament>(this.form, [], doc)
				.then((updated: Uacodetournament) => {
					this._core.copy(updated, doc);

					this._uacodetournamentService.update(doc);
				});
		},
		delete: (doc: Uacodetournament): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this uacodetournament?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No'),
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: async (): Promise<void> => {
							await firstValueFrom(this._uacodetournamentService.delete(doc));

							this.setRows();
						},
					},
				],
			});
		},
		buttons: [
			{
				icon: 'cloud_download',
				click: (doc: Uacodetournament): void => {
					this._form.modalUnique<Uacodetournament>('uacodetournament', 'url', doc);
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

	rows: Uacodetournament[] = [];

	constructor(
		private _translate: TranslateService,
		private _uacodetournamentService: UacodetournamentService,
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
				this._uacodetournamentService.get({ page }).subscribe((rows) => {
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
				.modalDocs<Uacodetournament>(create ? [] : this.rows)
				.then(async (uacodetournaments: Uacodetournament[]) => {
					if (create) {
						for (const uacodetournament of uacodetournaments) {
							this._preCreate(uacodetournament);

							await firstValueFrom(
								this._uacodetournamentService.create(uacodetournament)
							);
						}
					} else {
						for (const uacodetournament of this.rows) {
							if (
								!uacodetournaments.find(
									(localUacodetournament) => localUacodetournament._id === uacodetournament._id
								)
							) {
								await firstValueFrom(
									this._uacodetournamentService.delete(uacodetournament)
								);
							}
						}

						for (const uacodetournament of uacodetournaments) {
							const localUacodetournament = this.rows.find(
								(localUacodetournament) => localUacodetournament._id === uacodetournament._id
							);

							if (localUacodetournament) {
								this._core.copy(uacodetournament, localUacodetournament);

								await firstValueFrom(
									this._uacodetournamentService.update(localUacodetournament)
								);
							} else {
								this._preCreate(uacodetournament);

								await firstValueFrom(
									this._uacodetournamentService.create(uacodetournament)
								);
							}
						}
					}

					this.setRows();
				});
		};
	}

	private _preCreate(uacodetournament: Uacodetournament): void {
		delete uacodetournament.__created;
	}
}
