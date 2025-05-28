import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { Uacodequiz } from 'src/app/modules/uacodequiz/interfaces/uacodequiz.interface';
import { UacodequizService } from 'src/app/modules/uacodequiz/services/uacodequiz.service';

@Component({
	templateUrl: './quizzes.component.html',
	standalone: false
})
export class QuizzesComponent {
	// title Вікторини
	quizzes: Uacodequiz[] = [];

	constructor(
		public classService: UacodeclassService,
		private _quizService: UacodequizService,
		private _commandService: UacodeService,
		private _form: FormService,
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
		this._quizCreationForm.components[1].hidden = false;

		this._quizCreationForm.components[2].hidden = false;

		this._form.modal<Uacodequiz>(
			this._quizCreationForm,
			{
				label: 'Створити',
				click: async (document: unknown, close: () => void) => {
					close();

					const create: Uacodequiz = document as Uacodequiz;

					this._quizService
						.create(
							create.quiz
								? ({
										name:
											'Завдання вікторини «' +
											this._commandService.commands[
												this._commandService.commands.findIndex(
													(c) =>
														c.quiz === create.quiz
												)
											].name +
											'»',
										description: create.quiz,
										class: this.classService.classId
									} as Uacodequiz)
								: {
										...create,
										class: this.classService.classId
									}
						)
						.subscribe((created) => {
							this._router.navigateByUrl('/quiz/' + created._id);
						});
				}
			},
			{},
			(document) => {
				this._quizCreationForm.components[1].hidden = !!document.quiz;

				this._quizCreationForm.components[2].hidden = !!document.quiz;
			}
		);
	}

	private _quizCreationForm: FormInterface = this._form.getForm(
		'quizCreationForm',
		{
			formId: 'quizCreationForm',
			title: 'Форма створення вікторини',
			components: [
				{
					name: 'Select',
					key: 'quiz',
					fields: [
						{
							name: 'Placeholder',
							value: 'Оберіть готову вікторину'
						},
						{
							name: 'Label',
							value: 'Готова вікторина'
						},
						{
							name: 'Items',
							value: this._commandService.commands.map(
								(c) => c.quiz
							)
						},
						{
							name: 'Clearable',
							value: true
						}
					]
				},
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: 'Введіть назву вікторини...'
						},
						{
							name: 'Label',
							value: 'Назва вікторини'
						}
					]
				},
				{
					name: 'Text',
					key: 'description',
					fields: [
						{
							name: 'Placeholder',
							value: 'Введіть завдання вікторини...'
						},
						{
							name: 'Label',
							value: 'Завдання вікторини'
						}
					]
				}
			]
		}
	);
}
