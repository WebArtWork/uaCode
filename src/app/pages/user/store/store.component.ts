import { Component } from '@angular/core';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { AlertService, HttpService } from 'wacom';

@Component({
	templateUrl: './store.component.html',
	standalone: false
})
export class StoreComponent {
	// title Магазин
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
				name: 'Number',
				key: 'books',
				fields: [
					{
						name: 'Placeholder',
						value: 'Вкажіть кількість книг, які ви хочете замовити...'
					},
					{
						name: 'Label',
						value: 'Кількість'
					},
					{
						name: 'Textarea',
						value: true
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
				name: 'Text',
				key: 'postOffice',
				fields: [
					{
						name: 'Placeholder',
						value: 'Вкажіть номер/адресу відділення/поштомату'
					},
					{
						name: 'Label',
						value: 'Відділення/поштомат/індекс'
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
									message: `Name: ${this.submition['name']}\nPhone: ${this.submition['phone']}\nBooks: ${this.submition['books']}\nRegion: ${this.submition['region']}\nCity: ${this.submition['city']}\nPostOffice: ${this.submition['postOffice']}`
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
