import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { OptComponent } from './opt.component';

const routes: Routes = [
	{
		path: '',
		component: OptComponent
	}
];

@NgModule({
	declarations: [OptComponent],
	imports: [RouterModule.forChild(routes), CoreModule]
})
export class OptModule {}
