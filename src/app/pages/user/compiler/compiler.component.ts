import { Component } from '@angular/core';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { Router } from '@angular/router';

@Component({
	templateUrl: './compiler.component.html',
	styleUrls: ['./compiler.component.scss'],
	standalone: false
})
export class CompilerComponent {
	isQuestion = this._router.url.includes('/question/');

	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Doc form',
		components: [
			{
				name: 'Text',
				key: 'code',
				disabled: !!this.isQuestion,
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
				disabled: true,
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
				name: 'Text',
				key: 'answer',
				hidden: !this.isQuestion,
				class: 'wrong',
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

	isMenuOpen = false;

	constructor(
		private _uacodeService: UacodeService,
		private _form: FormService,
		private _router: Router
	) {
		if (this._router.url.includes('/command/')) {
			this.submition['code'] = this._uacodeService.getExample(
				Number(this._router.url.replace('/compiler/command/', ''))
			);

			this.compile();
		} else if (this._router.url.includes('/question/')) {
			this.submition['code'] = this._uacodeService.getQuestion(
				Number(this._router.url.replace('/compiler/question/', ''))
			);

			this.compile();
		}
	}

	compile() {
		// Очищаємо поле виводу перед компіляцією
		this.submition['output'] = '';

		// Локальна функція для виводу в "консоль" — додає текст до поля output
		const print = (message: string) => {
			this.submition['output'] += message + '\n';
		};

		// Об'єкт для збереження відповідностей між UA-командами та JS-командами
		const translations: Record<string, string> = {};

		// Заповнюємо translations на основі команд, які надає сервіс
		this._uacodeService.commands.forEach((cmd) => {
			translations[cmd.name] = cmd.execute;
		});

		// Визначаємо логічні оператори, які треба замінити окремо
		const logicalOperators: Record<string, string> = {
			' та ': ' && ', // логічне І
			' або ': ' || ' // логічне АБО
		};

		// Отримуємо введений український код та обрізаємо зайві пробіли
		let translatedCode = this.submition['code'].trim();

		// Заміна ключових слів з української на відповідні JS-команди
		for (const [uaCmd, jsCmd] of Object.entries(translations)) {
			translatedCode = translatedCode.split(uaCmd).join(jsCmd);
		}

		// Заміна логічних операторів (обов'язково з пробілами, щоб уникнути помилкових збігів)
		for (const [uaCmd, jsCmd] of Object.entries(logicalOperators)) {
			translatedCode = translatedCode.replace(uaCmd, jsCmd);
		}

		try {
			// Виконання згенерованого JS-коду
			// eslint-disable-next-line no-eval — вимикаємо лінтер на це місце, бо eval зазвичай небезпечний
			eval(translatedCode);
		} catch (error: any) {
			// У разі помилки — виводимо повідомлення про помилку
			this.submition['output'] = 'Помилка в коді: ' + error.message;
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
