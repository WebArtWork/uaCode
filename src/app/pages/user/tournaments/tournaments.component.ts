import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { Uacodetournament } from 'src/app/modules/uacodetournament/interfaces/uacodetournament.interface';
import { UacodetournamentService } from 'src/app/modules/uacodetournament/services/uacodetournament.service';

@Component({
	templateUrl: './tournaments.component.html',
	styleUrls: ['./tournaments.component.scss'],
	standalone: false
})
export class TournamentsComponent {
	tournaments: Uacodetournament[] = [];

	constructor(
		private _tournamentService: UacodetournamentService,
		private _form: FormService,
		private _router: Router
	) {
		this._tournamentService
			.get({}, { name: 'public' })
			.subscribe((tournaments) => (this.tournaments = tournaments));
	}

	add(): void {
		this._form.modal<Uacodetournament>(this._tournamentCreationForm, {
			label: 'Create',
			click: async (tournament: unknown, close: () => void) => {
				close();

				this._tournamentService
					.create(tournament as Uacodetournament)
					.subscribe((created) => {
						this._router.navigateByUrl(
							'/tournament/' + created._id
						);
					});
			}
		});
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
							value: 'Enter your name'
						},
						{
							name: 'Label',
							value: 'Name'
						}
					]
				},
				{
					name: 'Select',
					key: 'method',
					fields: [
						{
							name: 'Items',
							value: ['Rock, Paper, Scissors']
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
							value: ['Reality']
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
}
