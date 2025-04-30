import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { UacodetournamentService } from 'src/app/modules/uacodetournament/services/uacodetournament.service';
import { Router } from '@angular/router';
import { UacodeparticipationService } from 'src/app/modules/uacodeparticipation/services/uacodeparticipation.service';
import { Uacodeparticipation } from 'src/app/modules/uacodeparticipation/interfaces/uacodeparticipation.interface';
import { AlertService, CoreService } from 'wacom';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss'],
	standalone: false
})
export class TournamentComponent {
	get mine(): boolean {
		return this.tournament.device === this._core.deviceID;
	}

	tournament = this._tournamentService.doc(
		this._router.url.replace('/tournament/', '')
	);

	method = {
		'Rock, Paper, Scissors': `Камінь, ножиці, папір`
	};

	variables = {
		'Rock, Paper, Scissors': `Змінна мійОстаннійХід\nЗмінна суперникаОстаннійХід\nЗмінна кількістьМоїхКаменів\nЗмінна кількістьМоїхПаперів\nЗмінна кількістьМоїхНожиців\nЗмінна кількістьСуперникаКаменів\nЗмінна кількістьСуперникаПаперів\nЗмінна кількістьСуперникаНожиців`
	};

	samples = {
		'Rock, Paper, Scissors': `Якщо (\n  кількістьСуперникаПаперів > кількістьСуперникаКаменів та \n  кількістьСуперникаПаперів > кількістьСуперникаНожиців\n) {\n  Поверни 'ножиці';\n} Інакше якщо (\n  кількістьСуперникаКаменів > кількістьСуперникаНожиців\n) {\n  Поверни 'папір';\n} Інакше {\n  Поверни 'камінь';\n}`
	};

	participations: Uacodeparticipation[] = [];

	participation: Uacodeparticipation;

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
				focused: true,
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
							const participation = {
								...this.submition,
								tournament: this.tournament._id,
								device: this._core.deviceID
							} as Uacodeparticipation;

							if (this.participation) {
								this._participationService
									.update(participation)
									.subscribe(() => {
										const part: Uacodeparticipation =
											this.participations.find(
												(p) =>
													p.device ===
													this._core.deviceID
											) as Uacodeparticipation;
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
						}
					}
				]
			}
		]
	});

	constructor(
		private _participationService: UacodeparticipationService,
		private _tournamentService: UacodetournamentService,
		private _clipboard: Clipboard,
		public userService: UserService,
		private _alert: AlertService,
		private _core: CoreService,
		private _form: FormService,
		private _router: Router
	) {
		this._load();
	}

	copySample() {
		this._clipboard.copy(this.samples[this.tournament.method]);

		this._alert.info({
			text: 'Скопійовано'
		});
	}

	private _load() {
		this._participationService
			.get({}, { name: 'public' })
			.subscribe((participations) => {
				this.participations = participations;

				if (
					participations.find((p) => p.device === this._core.deviceID)
				) {
					this.participation = participations.find(
						(p) => p.device === this._core.deviceID
					) as Uacodeparticipation;

					this.submition['name'] = this.participation.name;

					this.submition['code'] = this.participation.code;
				}
			});
	}
}
