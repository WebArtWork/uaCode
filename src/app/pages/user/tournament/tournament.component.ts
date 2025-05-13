import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { Router } from '@angular/router';
import { AlertService, CoreService, HttpService, SocketService } from 'wacom';
import { Clipboard } from '@angular/cdk/clipboard';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { Uacodetournamentparticipation } from 'src/app/modules/uacodetournamentparticipation/interfaces/uacodetournamentparticipation.interface';
import { UacodetournamentparticipationService } from 'src/app/modules/uacodetournamentparticipation/services/uacodetournamentparticipation.service';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';

@Component({
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss'],
	standalone: false
})
export class TournamentComponent {
	readonly isClass = this._router.url.split('/')[2] === 'class';

	readonly method = this._router.url.split('/')[3].split('%20').join(' ');

	get mine(): boolean {
		return true;
	}

	get options(): string[] {
		return this._participationService.options[this.method];
	}

	name: Record<string, string> = {
		'Rock, Paper, Scissors': `Камінь, ножиці, папір`,
		Magicians: 'Маги',
		"The Prisoner's Dilemma": `Дилема в'язня`
	};

	variables: Record<string, string> = {
		'Rock, Paper, Scissors': `Змінна мійОстаннійХід\nЗмінна суперникаОстаннійХід\nЗмінна кількістьМоїхКаменів\nЗмінна кількістьМоїхПаперів\nЗмінна кількістьМоїхНожиців\nЗмінна кількістьСуперникаКаменів\nЗмінна кількістьСуперникаПаперів\nЗмінна кількістьСуперникаНожиців`,
		Magicians:
			'Змінна моєОстаннєЗакляття\nЗмінна останнєЗакляттяСуперника\nЗмінна кількістьМоїхАтак\nЗмінна кількістьМоїхЗахистів\nЗмінна кількістьМоїхЛікувань\nЗмінна кількістьМоїхМедитацій\nЗмінна кількістьСуперникаАтак\nЗмінна кількістьСуперникаЗахистів\nЗмінна кількістьСуперникаЛікувань\nЗмінна кількістьСуперникаМедитацій\nЗмінна рівеньМогоЖиття\nЗмінна рівеньМоєїМани\nЗмінна рівеньЖиттяСуперника\nЗмінна рівеньМаниСуперника',
		"The Prisoner's Dilemma":
			'Змінна мійОстаннійВибір\nЗмінна останнійВибірСуперника\nЗмінна кількістьМоїхЗрад\nЗмінна кількістьМоїхМовчань\nЗмінна кількістьЗрадСуперника\nЗмінна кількістьМовчаньСуперника'
	};

	samples: Record<string, string> = {
		'Rock, Paper, Scissors': `Якщо (\n  кількістьСуперникаПаперів > кількістьСуперникаКаменів ТА \n  кількістьСуперникаПаперів > кількістьСуперникаНожиців\n) {\n  Поверни 'ножиці';\n} ІнакшеЯкщо (\n  кількістьСуперникаКаменів > кількістьСуперникаНожиців\n) {\n  Поверни 'папір';\n} Інакше {\n  Поверни 'камінь';\n}`,
		Magicians: `Якщо (рівеньМогоЖиття <= 30) {\n  Якщо (рівеньМоєїМани >= 20) {\n    Поверни 'лікування';\n  } Інакше {\n    Поверни 'медитація';\n  }\n} ІнакшеЯкщо (рівеньМоєїМани < 10) {\n  Поверни 'медитація';\n} ІнакшеЯкщо (\n  кількістьСуперникаАтак > кількістьСуперникаЗахистів\n) {\n  Поверни 'захист';\n} Інакше {\n  Поверни 'атака';\n}`,
		"The Prisoner's Dilemma": `Якщо (останнійВибірСуперника == 'зрадити') {\n  Поверни 'зрадити';\n} ІнакшеЯкщо (кількістьЗрадСуперника > кількістьМовчаньСуперника) {\n  Поверни 'зрадити';\n} Інакше {\n  Поверни 'мовчати';\n}`
	};

	participations: Uacodetournamentparticipation[] = [];

	participation: Uacodetournamentparticipation;

	submition: Record<string, unknown> = {
		name: '',
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

	constructor(
		private _participationService: UacodetournamentparticipationService,
		private _classService: UacodeclassService,
		private _commandService: UacodeService,
		public userService: UserService,
		private _socket: SocketService,
		private _clipboard: Clipboard,
		private _alert: AlertService,
		private _core: CoreService,
		private _form: FormService,
		private _http: HttpService,
		private _router: Router
	) {
		this._loadMine();

		this._load();

		this._socket.on('uacode', (data) => {
			if (
				data.method === this.method &&
				((!this.isClass && !data.class) ||
					data.class === this._classService.classId)
			) {
				this._load();
			}
		});
	}

	copySample() {
		this._clipboard.copy(this.samples[this.method]);

		this._alert.info({
			unique: 'copy',
			text: 'Скопійовано'
		});
	}

	start() {
		this._http
			.post('/api/uacode/start', {
				class: 'class'
			})
			.subscribe((participations: Uacodetournamentparticipation[]) => {
				if (participations) {
					participations.sort((a, b) => {
						return a.points - b.points;
					});

					this.participations = participations;
				}
			});
	}

	private _updateParticipation() {
		if (
			this._participationService.test[this.method](
				this._commandService.translate(this.submition['code'] as string)
			)
		) {
			const participation = {
				...this.submition,
				class: this.isClass ? this._classService.classId : null,
				method: this.method,
				device: this._core.deviceID
			} as Uacodetournamentparticipation;

			if (this.participation) {
				this._participationService
					.update(participation)
					.subscribe(() => {
						const part: Uacodetournamentparticipation =
							this.participations.find(
								(p) => p.device === this._core.deviceID
							) as Uacodetournamentparticipation;
						if (part) {
							part.name = participation.name;
						}
					});
			} else {
				this._participationService
					.create(participation)
					.subscribe(() => {
						this._load();
					});
			}
		} else {
			this._alert.error({
				unique: 'copy',
				text: 'Ваш код не повертає потрібні варіанти'
			});
		}
	}

	private _loadMine() {
		this._participationService
			.fetch(
				this.isClass
					? {
							device: this._core.deviceID,
							method: this.method,
							class: this._classService.classId
						}
					: {
							device: this._core.deviceID,
							method: this.method
						}
			)
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
			.get(
				{
					query:
						`method=${this.method}` +
						(this.isClass
							? '&class=' + this._classService.classId
							: '')
				},
				{ name: 'public' }
			)
			.subscribe((participations) => {
				participations.sort((a, b) => {
					return b.points - a.points;
				});

				this.participations = participations;
			});
	}
}
