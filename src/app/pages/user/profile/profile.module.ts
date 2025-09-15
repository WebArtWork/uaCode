import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FileModule } from 'src/app/core/modules/file/file.module';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule, FileModule],
	declarations: [ProfileComponent],
	providers: []
})
export class ProfileModule {}
