import { Component } from '@angular/core';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { Router } from '@angular/router';
import { CoreService, SocketService } from 'wacom';
import { Uacodequizparticipation } from 'src/app/modules/uacodequizparticipation/interfaces/uacodequizparticipation.interface';
import { UacodequizService } from 'src/app/modules/uacodequiz/services/uacodequiz.service';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { UacodequizparticipationService } from 'src/app/modules/uacodequizparticipation/services/uacodequizparticipation.service';
import { Value } from 'src/app/core/modules/input/input.component';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { Uacodequiz } from 'src/app/modules/uacodequiz/interfaces/uacodequiz.interface';

@Component({
	templateUrl: './quiz.component.html',
	styleUrls: ['./quiz.component.scss'],
	standalone: false
})
export class QuizComponent {
	quizId = this._router.url.replace('/quiz/', '');

	quiz = this._quizService.doc(this.quizId);

	loaded = false;

	participations: Uacodequizparticipation[] = [];

	participation: Uacodequizparticipation;

	submition: Record<string, unknown> = {
		name: localStorage.getItem('myname') || '',
		code: ''
	};

	participateForm: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Форма для участі',
		components: [
			{
				name: 'Text',
				key: 'name',
				fields: [
					{
						name: 'Placeholder',
						value: "Введіть ім'я"
					},
					{
						name: 'Label',
						value: "Ім'я"
					}
				]
			},
			{
				name: 'Text',
				key: 'code',
				fields: [
					{
						name: 'Placeholder',
						value: 'Введіть ваш код'
					},
					{
						name: 'Label',
						value: 'Код'
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
						value: 'Приєднатися'
					},
					{
						name: 'Submit',
						value: true
					},
					{
						name: 'Click',
						value: () => {
							this._updateParticipation();
						}
					}
				]
			}
		]
	});

	output = '';

	constructor(
		private _participationService: UacodequizparticipationService,
		public classService: UacodeclassService,
		private _quizService: UacodequizService,
		private _commandService: UacodeService,
		private _socket: SocketService,
		private _core: CoreService,
		private _form: FormService,
		private _router: Router
	) {
		this._load();

		this._socket.on('uacodequiz', (data) => {
			if (data === this.quizId) {
				this._load();

				if (this._participating) {
					this.loadParticipant();
				}
			}
		});

		this._core.onComplete('uacodeclass_loaded').then(() => {
			if (!this.classService.mineClass) {
				this._loadMine();
			}

			this.loaded = true;
		});
	}

	mutate(): void {
		this._quizMutateForm.components[1].hidden = false;

		this._quizMutateForm.components[2].hidden = false;

		this._form.modal<Uacodequiz>(
			this._quizMutateForm,
			{
				label: 'Create',
				click: async (document: unknown, close: () => void) => {
					close();

					const mutate: Uacodequiz = document as Uacodequiz;

					if (mutate.quiz) {
						this._core.copy(
							{
								name:
									'Завдання вікторини «' +
									this._commandService.commands[
										this._commandService.commands.findIndex(
											(c) => c.quiz === mutate.quiz
										)
									].name +
									'»',
								description: mutate.quiz
							},
							this.quiz
						);
					} else {
						this._core.copy(document, this.quiz);
					}

					this._quizService.update(this.quiz);
				}
			},
			this.quiz,
			(document) => {
				this._quizMutateForm.components[1].hidden = !!document.quiz;

				this._quizMutateForm.components[2].hidden = !!document.quiz;
			}
		);
	}

	private _quizMutateForm: FormInterface = this._form.getForm(
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

	updateQuiz(field: 'name' | 'description', value: Value) {
		this.quiz[field] = value as string;

		this._core.afterWhile(() => {
			this._quizService.update(this.quiz);
		});
	}

	updateGrade(part: Uacodequizparticipation, value: Value) {
		part.grade = value as string;

		this._core.afterWhile(() => {
			this._participationService.update(part, { name: 'owner' });
		});
	}

	loadParticipant(part: Uacodequizparticipation = this._participating) {
		this._participating = part;

		this._participationService
			.fetch(part, { name: 'owner' })
			.subscribe((participation) => {
				this.output = '';

				// Локальна функція для виводу в "консоль" — додає текст до поля output
				const print = (message: string) => {
					this.output += message + '\n';
				};

				try {
					const code = `(()=>{${this._commandService.translate(
						participation.code
					)}})()`;
					// Виконання згенерованого JS-коду
					// eslint-disable-next-line no-eval — вимикаємо лінтер на це місце, бо eval зазвичай небезпечний
					eval(code);
				} catch (error: any) {
					// У разі помилки — виводимо повідомлення про помилку
					this.output =
						'Помилка в коді: ' +
						this._commandService.translateErrorMessage(
							error.message
						);
				}

				this.participation = participation;
			});
	}

	private _participating: Uacodequizparticipation;

	private _updateParticipation() {
		localStorage.setItem(
			'myname',
			(this.submition['name'] as string) || ''
		);

		const participation = {
			...this.submition,
			quiz: this.quizId,
			device: this._core.deviceID
		} as Uacodequizparticipation;

		if (this.participation) {
			this._participationService
				.update({
					...this.participation,
					...participation
				})
				.subscribe(() => {
					const part: Uacodequizparticipation =
						this.participations.find(
							(p) => p.device === this._core.deviceID
						) as Uacodequizparticipation;

					if (part) {
						part.name = participation.name;
					}
				});
		} else {
			this._participationService
				.create(participation)
				.subscribe((created) => {
					this.participation = created;

					this._load();
				});
		}
	}

	private _loadMine() {
		this._participationService
			.fetch({
				device: this._core.deviceID,
				quiz: this.quizId
			})
			.subscribe((participation) => {
				if (participation) {
					this.participation = participation;

					this.submition['name'] = this.participation.name;

					this.submition['code'] = this.participation.code;
				}
			});
	}

	private _load() {
		this._participationService
			.get({
				query: 'quiz=' + this.quizId
			})
			.subscribe((participations) => {
				this.participations = participations;
			});
	}
}
