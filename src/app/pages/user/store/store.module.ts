import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { StoreComponent } from './store.component';

const routes: Routes = [
	{
		path: '',
		component: StoreComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [StoreComponent]
})
export class StoreModule {}
