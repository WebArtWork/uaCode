import { Component } from '@angular/core';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { UacodetournamentparticipationService } from 'src/app/modules/uacodetournamentparticipation/services/uacodetournamentparticipation.service';

@Component({
	templateUrl: './tournaments.component.html',
	styleUrls: ['./tournaments.component.scss'],
	standalone: false
})
export class TournamentsComponent {
	readonly methods = this._participationService.methods;

	readonly name = this._participationService.name;

	constructor(
		private _participationService: UacodetournamentparticipationService,
		public classService: UacodeclassService
	) {}
}
