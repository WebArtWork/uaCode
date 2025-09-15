import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FilesComponent } from './files.component';

const routes: Routes = [
	{
		path: '',
		component: FilesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [FilesComponent],
	providers: []
})
export class FilesModule {}
