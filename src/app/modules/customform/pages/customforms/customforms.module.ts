import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { CustomformsComponent } from './customforms.component';

const routes: Routes = [
	{
		path: '',
		component: CustomformsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CustomformsComponent],
	providers: []
})
export class CustomformsModule {}
