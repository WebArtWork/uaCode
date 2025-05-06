import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { AlertService, HttpService } from 'wacom';

@Component({
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss'],
	standalone: false
})
export class StoreComponent {
	submition: Record<string, unknown> = {};

	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Doc form',
		components: [
			{
				name: 'Text',
				key: 'name',
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
				name: 'Number',
				key: 'books',
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
					},
					{
						name: 'Click',
						value: () => {
							this._http
								.post('/api/bot/message', {
									chatid: '-4759548231',
									message: `Name: ${this.submition['name']}\nPhone: ${this.submition['phone']}\nBooks: ${this.submition['books']}`
								})
								.subscribe(() => {
									this._alert.show({
										text: 'We will contact with you'
									});
								});
						}
					}
				]
			}
		]
	});

	isMenuOpen = false;

	constructor(
		public userService: UserService,
		private _alert: AlertService,
		private _http: HttpService,
		private _form: FormService
	) {}
}
