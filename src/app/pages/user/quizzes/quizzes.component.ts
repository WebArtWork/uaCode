import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { Uacodequiz } from 'src/app/modules/uacodequiz/interfaces/uacodequiz.interface';
import { UacodequizService } from 'src/app/modules/uacodequiz/services/uacodequiz.service';

@Component({
	templateUrl: './quizzes.component.html',
	styleUrls: ['./quizzes.component.scss'],
	standalone: false
})
export class QuizzesComponent {
	quizzes: Uacodequiz[] = [];

	constructor(
		public classService: UacodeclassService,
		private _quizService: UacodequizService,
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
		this._form.modal<Uacodequiz>(this._quizCreationForm, {
			label: 'Create',
			click: async (tournament: unknown, close: () => void) => {
				close();

				this._quizService
					.create({
						...(tournament as Uacodequiz),
						class: this.classService.classId
					})
					.subscribe((created) => {
						this._router.navigateByUrl('/quiz/' + created._id);
					});
			}
		});
	}

	private _quizCreationForm: FormInterface = this._form.getForm(
		'quizCreationForm',
		{
			formId: 'quizCreationForm',
			title: 'Quiz creation',
			components: [
				{
					name: 'Text',
					key: 'name',
					focused: true,
					fields: [
						{
							name: 'Placeholder',
							value: "Введіть назву групи"
						},
						{
							name: 'Label',
							value: "Назва групи"
						}
					]
				},
				{
					name: 'Text',
					key: 'description',
					fields: [
						{
							name: 'Placeholder',
							value: 'Введіть код групи'
						},
						{
							name: 'Label',
							value: 'Код групи'
						}
					]
				}
			]
		}
	);
}
