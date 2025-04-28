import {
	SimpleChanges,
	EventEmitter,
	Component,
	OnChanges,
	Output,
	Input,
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { UacodeparticipationService } from '../../services/uacodeparticipation.service';
import { Uacodeparticipation } from '../../interfaces/uacodeparticipation.interface';

@Component({
	selector: 'uacodeparticipation-selector',
	templateUrl: './uacodeparticipation-selector.component.html',
	styleUrls: ['./uacodeparticipation-selector.component.scss'],
	imports: [SelectModule],
})
export class UacodeparticipationSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodeparticipation[] {
		return this._uacodeparticipationService.uacodeparticipations;
	}

	constructor(private _uacodeparticipationService: UacodeparticipationService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
