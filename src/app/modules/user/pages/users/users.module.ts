import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { UsersComponent } from './users.component';

const routes: Routes = [
	{
		path: '',
		component: UsersComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [UsersComponent],
	providers: []
})
export class UsersModule {}
