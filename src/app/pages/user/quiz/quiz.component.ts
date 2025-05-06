import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
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

@Component({
	templateUrl: './quiz.component.html',
	styleUrls: ['./quiz.component.scss'],
	standalone: false
})
export class QuizComponent {
	quizId = this._router.url.replace('/quiz/', '');

	quiz = this._quizService.doc(this.quizId);

	mine = false;

	loaded = false;

	participations: Uacodequizparticipation[] = [];

	participation: Uacodequizparticipation;

	submition: Record<string, unknown> = {
		name: '',
		code: ''
	};

	participateForm: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Participate form',
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
				key: 'code',
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter your code'
					},
					{
						name: 'Label',
						value: 'Code'
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
						value: 'Update'
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
		private _classService: UacodeclassService,
		private _quizService: UacodequizService,
		private _commandService: UacodeService,
		public userService: UserService,
		private _socket: SocketService,
		private _core: CoreService,
		private _form: FormService,
		private _router: Router
	) {
		this._load();

		this._mine();
	}

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

	loadParticipant(part: Uacodequizparticipation) {
		this._participationService
			.fetch(part, { name: 'owner' })
			.subscribe((participation) => {
				this.output = '';

				// Локальна функція для виводу в "консоль" — додає текст до поля output
				const print = (message: string) => {
					this.output += message + '\n';
				};

				try {
					const code = this._commandService.translate(
						participation.code
					);
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

	private _mine() {
		this._core.onComplete('uacodeclass_loaded').then(() => {
			const classes = this._classService.getDocs();

			if (this.quiz.class) {
				const classDocument = classes.find(
					(c) => c._id === this.quiz.class
				);

				this.mine = classDocument?.device === this._core.deviceID;

				if (this.mine) {
					this._socket.on('uacodequiz', (data) => {
						if (data === this.quizId) {
							this._load();
						}
					});
				} else {
					this._loadMine();
				}

				this.loaded = true;
			} else {
				setTimeout(this._mine.bind(this), 500);
			}
		});
	}

	private _updateParticipation() {
		const participation = {
			...this.submition,
			quiz: this.quizId,
			device: this._core.deviceID
		} as Uacodequizparticipation;

		if (this.participation) {
			this._participationService.update(participation).subscribe(() => {
				const part: Uacodequizparticipation = this.participations.find(
					(p) => p.device === this._core.deviceID
				) as Uacodequizparticipation;

				if (part) {
					part.name = participation.name;
				}
			});
		} else {
			this._participationService.create(participation).subscribe(() => {
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
