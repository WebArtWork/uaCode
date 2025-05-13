import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UacodequizparticipationService } from '../../services/uacodequizparticipation.service';
import { Uacodequizparticipation } from '../../interfaces/uacodequizparticipation.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { uacodequizparticipationFormComponents } from '../../formcomponents/uacodequizparticipation.formcomponents';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TableModule } from 'src/app/core/modules/table/table.module';
import { CrudComponent } from 'wacom';

@Component({
	imports: [CommonModule, TableModule],
	templateUrl: './quizparticipantions.component.html',
	styleUrls: ['./quizparticipantions.component.scss'],
})
export class QuizparticipantionsComponent extends CrudComponent<
	UacodequizparticipationService,
	Uacodequizparticipation,
	FormInterface
> {
	columns = ['name', 'description'];

	config = {
		...this.getConfig(),
	};

	constructor(
		_uacodequizparticipationService: UacodequizparticipationService,
		_translate: TranslateService,
		_form: FormService
	) {
		super(uacodequizparticipationFormComponents, _form, _translate, _uacodequizparticipationService);

		this.setDocuments();
	}
}
