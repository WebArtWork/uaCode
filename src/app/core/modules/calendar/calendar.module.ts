import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '../button/button.module';
import { CalendarComponent } from './calendar.component';

@NgModule({
	declarations: [CalendarComponent],
	imports: [CommonModule, ButtonModule],
	exports: [CalendarComponent]
})
export class CalendarModule {}
