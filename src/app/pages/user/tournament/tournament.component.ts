import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { Uacodetournamentparticipation } from 'src/app/modules/uacodetournamentparticipation/interfaces/uacodetournamentparticipation.interface';
import { UacodetournamentparticipationService } from 'src/app/modules/uacodetournamentparticipation/services/uacodetournamentparticipation.service';
import { AlertService, CoreService, SocketService } from 'wacom';

@Component({
	templateUrl: './tournament.component.html',
	standalone: false
})
export class TournamentComponent {
	// title {{name[method]}}
	readonly isClass = this._router.url.split('/')[2] === 'class';

	readonly method = this._router.url.split('/')[3].split('%20').join(' ');

	readonly name = this._tournamentService.nameTranslation;

	get options(): string[] {
		return this._tournamentService.options[this.method];
	}

	variables: Record<string, string> =
		this._tournamentService.availableVariables;

	samples: Record<string, string> = this._tournamentService.codeSamples;

	participations: Uacodetournamentparticipation[] = [];

	participation: Uacodetournamentparticipation;

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
						value: "Введіть ім'я..."
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
						value: 'Введіть ваш код...'
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
		private _tournamentService: TournamentService,
		private _classService: UacodeclassService,
		private _commandService: UacodeService,
		private _socket: SocketService,
		private _clipboard: Clipboard,
		private _alert: AlertService,
		private _core: CoreService,
		private _form: FormService,
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

	private _updateParticipation() {
		localStorage.setItem(
			'myname',
			(this.submition['name'] as string) || ''
		);

		if (
			this._tournamentService.scriptLogicVerification[this.method](
				this._commandService.translate(this.submition['code'] as string)
			)
		) {
			if (this.participation) {
				this._core.copy(this.submition, this.participation);

				this._participationService
					.update(this.participation)
					.subscribe(() => {
						const part: Uacodetournamentparticipation =
							this.participations.find(
								(p) => p.device === this._core.deviceID
							) as Uacodetournamentparticipation;

						if (part) {
							part.name = this.participation.name;
						}
					});
			} else {
				this._participationService
					.create({
						...this.submition,
						class: this.isClass ? this._classService.classId : null,
						method: this.method,
						device: this._core.deviceID
					} as Uacodetournamentparticipation)
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
