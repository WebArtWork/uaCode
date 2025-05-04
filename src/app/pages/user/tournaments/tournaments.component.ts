import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { Uacodetournament } from 'src/app/modules/uacodetournament/interfaces/uacodetournament.interface';
import { UacodetournamentService } from 'src/app/modules/uacodetournament/services/uacodetournament.service';
import { AlertService, CoreService } from 'wacom';

@Component({
	templateUrl: './tournaments.component.html',
	styleUrls: ['./tournaments.component.scss'],
	standalone: false
})
export class TournamentsComponent {
	readonly methods = this._tournamentService.methods;

	tournaments: Uacodetournament[] = [];

	loading = true;

	constructor(
		private _tournamentService: UacodetournamentService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService,
		private _router: Router
	) {
		this._tournamentService
			.get({}, { name: 'public' })
			.subscribe((tournaments) => {
				this.tournaments = tournaments;

				this.loading = false;
			});
	}

	add(): void {
		this._form.modal<Uacodetournament>(
			this._tournamentCreationForm,
			{
				label: 'Create',
				click: async (tournament: unknown, close: () => void) => {
					close();

					this._tournamentService
						.create({
							...(tournament as Uacodetournament),
							device: this._core.deviceID
						})
						.subscribe((created) => {
							this._router.navigateByUrl(
								'/tournament/private/' + created._id
							);
						});
				}
			},
			{
				method: this._tournamentService.methods[0]
			}
		);
	}

	open(tournament: Uacodetournament) {
		if (tournament.isPrivate) {
			this._form.modal<Record<string, number>>(this._formJoin, {
				label: 'Change',
				click: (submition: unknown, close: () => void) => {
					close();

					this._tournamentService
						.fetch(
							{
								code: Number(
									(submition as { code: number }).code
								)
							},
							{ name: 'test' }
						)
						.subscribe((found) => {
							if (found) {
								this._router.navigateByUrl(
									'/tournament/private/' + tournament._id
								);
							} else {
								this._alert.error({
									text: 'Tournament not found'
								});
							}
						});
				}
			});
		} else {
			this._router.navigateByUrl('/tournament/private/' + tournament._id);
		}
	}

	private _tournamentCreationForm: FormInterface = this._form.getForm(
		'tournamentCreationForm',
		{
			formId: 'tournamentCreationForm',
			title: 'Tournament creation',
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
					name: 'Boolean',
					key: 'isPrivate',
					fields: [
						{
							name: 'Label',
							value: 'Private'
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
				},
				{
					name: 'Select',
					key: 'method',
					fields: [
						{
							name: 'Items',
							value: this._tournamentService.methods
						},
						{
							name: 'Placeholder',
							value: 'Enter your bio'
						},
						{
							name: 'Label',
							value: 'Bio'
						}
					]
				},
				{
					name: 'Select',
					key: 'tags',
					fields: [
						{
							name: 'Items',
							value: ['Reality', 'One Mirror']
						},
						{
							name: 'Placeholder',
							value: 'Enter your phone'
						},
						{
							name: 'Label',
							value: 'Phone'
						},
						{
							name: 'Multiple',
							value: true
						}
					]
				}
			]
		}
	);

	private _formJoin: FormInterface = this._form.getForm('formJoin', {
		formId: 'formJoin',
		title: 'Join tournament',
		components: [
			{
				name: 'Text',
				key: 'code',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter code'
					},
					{
						name: 'Label',
						value: 'Code'
					}
				]
			}
		]
	});
}
