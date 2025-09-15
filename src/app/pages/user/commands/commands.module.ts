import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { CommandsComponent } from './commands.component';

const routes: Routes = [
	{
		path: '',
		component: CommandsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CommandsComponent]
})
export class CommandsModule {}
