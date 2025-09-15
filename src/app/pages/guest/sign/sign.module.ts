import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { SignComponent } from './sign.component';

const routes: Routes = [
	{
		path: '',
		component: SignComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [SignComponent],
	providers: []
})
export class SignModule {}
