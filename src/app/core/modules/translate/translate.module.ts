import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WacomModule } from 'wacom';
import { TranslateDirective } from './translate.directive';
import { TranslatePipe } from './translate.pipe';

@NgModule({
	imports: [CommonModule, FormsModule, WacomModule],
	declarations: [TranslateDirective, TranslatePipe],
	exports: [TranslateDirective, TranslatePipe],
	providers: []
})
export class TranslateModule {}
