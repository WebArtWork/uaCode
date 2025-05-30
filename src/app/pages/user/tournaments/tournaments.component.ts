import { Component } from '@angular/core';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { UacodeclassService } from 'src/app/modules/uacodeclass/services/uacodeclass.service';
import { UacodetournamentparticipationService } from 'src/app/modules/uacodetournamentparticipation/services/uacodetournamentparticipation.service';

@Component({
	templateUrl: './tournaments.component.html',
	styleUrls: ['./tournaments.component.scss'],
	standalone: false
})
export class TournamentsComponent {
	readonly methods = this._tournamentService.methods;

	readonly name = this._tournamentService.nameTranslation;

	constructor(
		private _participationService: UacodetournamentparticipationService,
		private _tournamentService: TournamentService,
		public classService: UacodeclassService
	) {}
}
