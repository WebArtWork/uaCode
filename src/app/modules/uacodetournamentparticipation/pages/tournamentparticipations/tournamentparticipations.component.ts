import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TableModule } from 'src/app/core/modules/table/table.module';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { CrudComponent } from 'wacom';
import { uacodetournamentparticipationFormComponents } from '../../formcomponents/uacodetournamentparticipation.formcomponents';
import { Uacodetournamentparticipation } from '../../interfaces/uacodetournamentparticipation.interface';
import { UacodetournamentparticipationService } from '../../services/uacodetournamentparticipation.service';

@Component({
	imports: [CommonModule, TableModule],
	templateUrl: './tournamentparticipations.component.html',
	styleUrls: ['./tournamentparticipations.component.scss']
})
export class TournamentparticipationsComponent extends CrudComponent<
	UacodetournamentparticipationService,
	Uacodetournamentparticipation,
	FormInterface
> {
	columns = ['name', 'description'];

	config = {
		...this.getConfig()
	};

	constructor(
		_uacodetournamentparticipationService: UacodetournamentparticipationService,
		_translate: TranslateService,
		_form: FormService
	) {
		super(
			uacodetournamentparticipationFormComponents,
			_form,
			_translate,
			_uacodetournamentparticipationService
		);

		this.setDocuments();
	}
}
