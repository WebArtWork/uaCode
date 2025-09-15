import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { DocumentComponent } from './document.component';

const routes: Routes = [
	{
		path: '',
		component: DocumentComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [DocumentComponent]
})
export class DocumentModule {}
