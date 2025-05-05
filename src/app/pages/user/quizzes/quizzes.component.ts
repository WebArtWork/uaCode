import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { Uacodequiz } from 'src/app/modules/uacodequiz/interfaces/uacodequiz.interface';
import { UacodequizService } from 'src/app/modules/uacodequiz/services/uacodequiz.service';
import { Uacodetournament } from 'src/app/modules/uacodetournament/interfaces/uacodetournament.interface';
import { UacodetournamentService } from 'src/app/modules/uacodetournament/services/uacodetournament.service';
import { CoreService } from 'wacom';

@Component({
	templateUrl: './quizzes.component.html',
	styleUrls: ['./quizzes.component.scss'],
	standalone: false
})
export class QuizzesComponent {
	quizzes: Uacodequiz[] = [];

	constructor(
		private _tournamentService: UacodetournamentService,
		private _quizService: UacodequizService,
		private _form: FormService,
		private _core: CoreService,
		private _router: Router
	) {}

	load(classId: string): void {
		this._quizService
			.get({
				query: 'class=' + classId
			})
			.subscribe((quizzes) => {
				this.quizzes = quizzes;
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
}
