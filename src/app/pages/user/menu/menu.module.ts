import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { MenuComponent } from './menu.component';

const routes: Routes = [
	{
		path: '',
		component: MenuComponent
	}
];

@NgModule({
	declarations: [MenuComponent],
	imports: [RouterModule.forChild(routes), CoreModule]
})
export class MenuModule {}
