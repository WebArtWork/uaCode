import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FranchiseComponent } from './franchise.component';

const routes: Routes = [
	{
		path: '',
		component: FranchiseComponent
	}
];

@NgModule({
	declarations: [FranchiseComponent],
	imports: [RouterModule.forChild(routes), CoreModule]
})
export class FranchiseModule {}
