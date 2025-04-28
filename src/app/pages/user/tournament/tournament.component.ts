import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { UacodetournamentService } from 'src/app/modules/uacodetournament/services/uacodetournament.service';
import { Router } from '@angular/router';

@Component({
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss'],
	standalone: false
})
export class TournamentComponent {
	tournament = this._tournamentService.doc(
		this._router.url.replace('/tournament/', '')
	);

	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Doc form',
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
				name: 'Text',
				key: 'phone',
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter your phone'
					},
					{
						name: 'Label',
						value: 'Phone'
					}
				]
			},
			{
				name: 'Text',
				key: 'bio',
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter your bio'
					},
					{
						name: 'Label',
						value: 'Bio'
					},
					{
						name: 'Textarea',
						value: true
					}
				]
			},
			{
				name: 'Button',
				fields: [
					{
						name: 'Label',
						value: "Let's go"
					},
					{
						name: 'Submit',
						value: true
					}
				]
			}
		]
	});

	isMenuOpen = false;

	constructor(
		private _tournamentService: UacodetournamentService,
		public userService: UserService,
		private _form: FormService,
		private _router: Router
	) {}

	back(): void {
		window.history.back();
	}
}
