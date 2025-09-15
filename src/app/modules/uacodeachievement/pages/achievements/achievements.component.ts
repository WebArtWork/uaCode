import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormService } from 'src/app/core/modules/form/form.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { TableModule } from 'src/app/core/modules/table/table.module';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { CrudComponent } from 'wacom';
import { uacodeachievementFormComponents } from '../../formcomponents/uacodeachievement.formcomponents';
import { Uacodeachievement } from '../../interfaces/uacodeachievement.interface';
import { UacodeachievementService } from '../../services/uacodeachievement.service';

@Component({
	imports: [CommonModule, TableModule],
	templateUrl: './achievements.component.html',
	styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent extends CrudComponent<
	UacodeachievementService,
	Uacodeachievement,
	FormInterface
> {
	columns = ['name', 'description'];

	config = {
		...this.getConfig()
	};

	constructor(
		_uacodeachievementService: UacodeachievementService,
		_translate: TranslateService,
		_form: FormService
	) {
		super(
			uacodeachievementFormComponents,
			_form,
			_translate,
			_uacodeachievementService
		);

		this.setDocuments();
	}
}
