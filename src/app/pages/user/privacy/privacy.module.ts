import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { PrivacyComponent } from './privacy.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: PrivacyComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [PrivacyComponent]
})
export class PrivacyModule {}
