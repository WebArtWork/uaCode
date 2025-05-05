import {
	SimpleChanges,
	EventEmitter,
	Component,
	OnChanges,
	Output,
	Input,
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { UacodequizService } from '../../services/uacodequiz.service';
import { Uacodequiz } from '../../interfaces/uacodequiz.interface';

@Component({
	selector: 'uacodequiz-selector',
	templateUrl: './uacodequiz-selector.component.html',
	styleUrls: ['./uacodequiz-selector.component.scss'],
	imports: [SelectModule],
})
export class UacodequizSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodequiz[] {
		return this._uacodequizService.uacodequizs;
	}

	constructor(private _uacodequizService: UacodequizService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
