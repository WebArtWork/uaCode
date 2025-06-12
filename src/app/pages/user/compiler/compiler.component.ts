import { Component } from '@angular/core';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { Router } from '@angular/router';

@Component({
	templateUrl: './compiler.component.html',
	standalone: false
})
export class CompilerComponent {
	// title Компілятор
	isQuestion = this._router.url.includes('/question/');

	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: '',
		components: [
			{
				name: 'Text',
				key: 'code',
				class: 'codeBlock',
				disabled: !!this.isQuestion,
				fields: [
					{
						name: 'Placeholder',
						value: 'Введіть ваш код...'
					},
					{
						name: 'Label',
						value: 'Введення'
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
						value: 'Запустити'
					},
					{
						name: 'Submit',
						value: true
					},
					{
						name: 'Click',
						value: () => {
							this.compile();
						}
					}
				]
			},
			{
				name: 'Text',
				key: 'output',
				hidden: this.isQuestion,
				class: 'codeBlock',
				disabled: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'Тут буде ваш результат...'
					},
					{
						name: 'Label',
						value: 'Виведення'
					},
					{
						name: 'Textarea',
						value: true
					}
				]
			},
			{
				name: 'Text',
				key: 'answer',
				hidden: !this.isQuestion,
				class: 'codeBlock wrong',
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
			}
		]
	});

	submition: Record<string, string> = {
		code: '',
		answer: '',
		output: ''
	};

	constructor(
		private _commandService: UacodeService,
		private _form: FormService,
		private _router: Router
	) {
		if (this._router.url.includes('/command/')) {
			this.submition['code'] = this._commandService.getExample(
				Number(this._router.url.replace('/compiler/command/', ''))
			);

			this.compile(true);
		} else if (this._router.url.includes('/question/')) {
			this.submition['code'] = this._commandService.getQuestion(
				Number(this._router.url.replace('/compiler/question/', ''))
			);

			this.compile(true);
		}
	}

	compile(skipAlert = false) {
		// Очищаємо поле виводу перед компіляцією
		this.submition['output'] = '';

		// Локальна функція для виводу в "консоль" — додає текст до поля output
		const print = (message: string) => {
			this.submition['output'] +=
				this._commandService.translateErrorMessage(message) + '\n';
		};

		try {
			const code = `(()=>{${this._commandService.translate(this.submition['code'])}})()`;
			// Виконання згенерованого JS-коду
			// eslint-disable-next-line no-eval — вимикаємо лінтер на це місце, бо eval зазвичай небезпечний

			eval(
				skipAlert
					? code
							.split('\n')
							.filter((line) => !line.includes('alert('))
							.join('\n')
					: code
			);
		} catch (error: any) {
			// У разі помилки — виводимо повідомлення про помилку
			this.submition['output'] =
				'Помилка в коді: ' +
				this._commandService.translateErrorMessage(error.message);
		}
	}

	testAnswer() {
		if (this.isQuestion) {
			this.formDoc.components[3].class =
				this.submition['output'].trim() ===
				this.submition['answer'].trim()
					? 'right'
					: 'wrong';
		}
	}

	back(): void {
		window.history.back();
	}
}
