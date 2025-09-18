import { Component } from '@angular/core';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { AlertService, HttpService } from 'wacom';

@Component({
	selector: 'app-mentor',
	standalone: false,
	templateUrl: './mentor.component.html',
	styleUrl: './mentor.component.scss'
})
export class MentorComponent {
	submition: Record<string, unknown> = {};

	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Оформлення замовлення',
		components: [
			{
				name: 'Text',
				key: 'name',
				fields: [
					{
						name: 'Placeholder',
						value: "Введіть ваші прізвище та ім'я..."
					},
					{
						name: 'Label',
						value: "Прізвище й ім'я"
					}
				]
			},
			{
				name: 'Text',
				key: 'phone',
				fields: [
					{
						name: 'Placeholder',
						value: 'Введіть ваш номер телефону...'
					},
					{
						name: 'Label',
						value: 'Телефон'
					}
				]
			},
			{
				name: 'Text',
				key: 'region',
				fields: [
					{
						name: 'Placeholder',
						value: 'Вкажіть ваш регіон/область...'
					},
					{
						name: 'Label',
						value: 'Регіон / Область'
					}
				]
			},
			{
				name: 'Text',
				key: 'city',
				fields: [
					{
						name: 'Placeholder',
						value: 'Вкажіть ваше місто...'
					},
					{
						name: 'Label',
						value: 'Місто'
					}
				]
			},
			{
				name: 'Button',
				fields: [
					{
						name: 'Label',
						value: 'Замовити'
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
									message: `Franchise\nName: ${this.submition['name']}\nPhone: ${this.submition['phone']}\nRegion: ${this.submition['region']}\nCity: ${this.submition['city']}`
								})
								.subscribe(() => {
									this._alert.show({
										text: 'Дякуємо за замовлення!\n Ми сконтактуємо з вами найближчим часом'
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
		private _alert: AlertService,
		private _http: HttpService,
		private _form: FormService
	) {}
}
