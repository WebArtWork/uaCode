import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UacodetournamentparticipationService } from '../../services/uacodetournamentparticipation.service';
import { Uacodetournamentparticipation } from '../../interfaces/uacodetournamentparticipation.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { uacodetournamentparticipationFormComponents } from '../../formcomponents/uacodetournamentparticipation.formcomponents';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TableModule } from 'src/app/core/modules/table/table.module';
import { CrudComponent } from 'wacom';

@Component({
	imports: [CommonModule, TableModule],
	templateUrl: './tournamentparticipations.component.html',
	styleUrls: ['./tournamentparticipations.component.scss'],
})
export class TournamentparticipationsComponent extends CrudComponent<
	UacodetournamentparticipationService,
	Uacodetournamentparticipation,
	FormInterface
> {
	columns = ['name', 'description'];

	config = {
		...this.getConfig(),
	};

	constructor(
		_uacodetournamentparticipationService: UacodetournamentparticipationService,
		_translate: TranslateService,
		_form: FormService
	) {
		super(uacodetournamentparticipationFormComponents, _form, _translate, _uacodetournamentparticipationService);

		this.setDocuments();
	}
}
