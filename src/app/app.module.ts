import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Core
import { GuestComponent } from './core/theme/guest/guest.component';
import { UserComponent } from './core/theme/user/user.component';
import { PublicComponent } from './core/theme/public/public.component';
import { AppComponent } from './app.component';
import { CoreModule } from 'src/app/core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// config
import { WacomModule, MetaGuard } from 'wacom';
import { environment } from 'src/environments/environment';
// guards
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { AdminsGuard } from './core/guards/admins.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import * as io from 'socket.io-client';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/compiler',
		pathMatch: 'full'
	},
	{
		path: '',
		canActivate: [GuestGuard],
		component: GuestComponent,
		children: [
			/* guest */
			{
				path: 'sign',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Sign'
					}
				},
				loadChildren: () =>
					import('./pages/guest/sign/sign.module').then(
						(m) => m.SignModule
					)
			}
		]
	},
	{
		path: '',
		canActivate: [AuthenticatedGuard],
		component: UserComponent,
		children: [
			{
				path: 'profile',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'My Profile'
					}
				},
				loadChildren: () =>
					import('./pages/user/profile/profile.module').then(
						(m) => m.ProfileModule
					)
			}
		]
	},
	{
		path: '',
		component: PublicComponent,
		children: [
			/* user */
			{
				path: 'privacy',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Privacy'
					}
				},
				loadChildren: () => import('./pages/user/privacy/privacy.module').then(m => m.PrivacyModule)
			}, 
			{
				path: 'achievements',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Achievements'
					}
				},
				loadChildren: () =>
					import(
						'./pages/user/achievements/achievements.module'
					).then((m) => m.AchievementsModule)
			},
			{
				path: 'quizparticipantions',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Quizparticipantions'
					}
				},
				loadChildren: () =>
					import(
						'./modules/uacodequizparticipation/pages/quizparticipantions/quizparticipantions.routes'
					).then((r) => r.quizparticipantionsRoutes)
			},
			{
				path: 'tournamentparticipations',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Tournamentparticipations'
					}
				},
				loadChildren: () =>
					import(
						'./modules/uacodetournamentparticipation/pages/tournamentparticipations/tournamentparticipations.routes'
					).then((r) => r.tournamentparticipationsRoutes)
			},
			{
				path: 'store',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Store'
					}
				},
				loadChildren: () =>
					import('./pages/user/store/store.module').then(
						(m) => m.StoreModule
					)
			},
			{
				path: 'allquizes',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Allquizes'
					}
				},
				loadChildren: () =>
					import(
						'./modules/uacodequiz/pages/allquizes/allquizes.module'
					).then((m) => m.AllquizesModule)
			},
			{
				path: 'classes',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Classes'
					}
				},
				loadChildren: () =>
					import(
						'./modules/uacodeclass/pages/classes/classes.module'
					).then((m) => m.ClassesModule)
			},
			{
				path: 'quiz',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Quiz'
					}
				},
				loadChildren: () =>
					import('./pages/user/quiz/quiz.module').then(
						(m) => m.QuizModule
					)
			},
			{
				path: 'quizzes',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Quizzes'
					}
				},
				loadChildren: () =>
					import('./pages/user/quizzes/quizzes.module').then(
						(m) => m.QuizzesModule
					)
			},
			{
				path: 'tournament',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Tournament'
					}
				},
				loadChildren: () =>
					import('./pages/user/tournament/tournament.module').then(
						(m) => m.TournamentModule
					)
			},
			{
				path: 'tournaments',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Tournaments'
					}
				},
				loadChildren: () =>
					import('./pages/user/tournaments/tournaments.module').then(
						(m) => m.TournamentsModule
					)
			},
			{
				path: 'commands',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Commands'
					}
				},
				loadChildren: () =>
					import('./pages/user/commands/commands.module').then(
						(m) => m.CommandsModule
					)
			},
			{
				path: 'compiler',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Compiler'
					}
				},
				loadChildren: () =>
					import('./pages/user/compiler/compiler.module').then(
						(m) => m.CompilerModule
					)
			}
		]
	},
	{
		path: 'admin',
		canActivate: [AdminsGuard],
		component: UserComponent,
		children: [
			/* admin */
			{
				path: 'achievements',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Achievements'
					}
				},
				loadChildren: () =>
					import(
						'./modules/uacodeachievement/pages/achievements/achievements.routes'
					).then((r) => r.achievementsRoutes)
			},
			{
				path: 'users',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Users'
					}
				},
				loadChildren: () =>
					import('./modules/user/pages/users/users.module').then(
						(m) => m.UsersModule
					)
			},
			{
				path: 'forms',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Forms'
					}
				},
				loadChildren: () =>
					import(
						'./modules/customform/pages/customforms/customforms.module'
					).then((m) => m.CustomformsModule)
			},
			{
				path: 'translates',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Translates'
					}
				},
				loadChildren: () =>
					import(
						'./core/modules/translate/pages/translates/translates.module'
					).then((m) => m.TranslatesModule)
			}
		]
	},
	{
		path: '**',
		redirectTo: 'compiler',
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [
		AppComponent,
		GuestComponent,
		UserComponent,
		PublicComponent
	],
	imports: [
		CoreModule,
		BrowserModule,
		BrowserAnimationsModule,
		WacomModule.forRoot({
			store: {},
			http: {
				url: environment.url
			},
			socket: {
				url: environment.url
			},
			io,
			meta: {
				useTitleSuffix: true,
				defaults: {
					title: environment.meta.title,
					favicon: environment.meta.favicon,
					description: environment.meta.description,
					titleSuffix: ' | ' + environment.meta.title,
					'og:image': environment.meta.image
				}
			},
			modal: {
				modals: {
					/* modals */
				}
			},
			alert: {
				alerts: {
					/* alerts */
				}
			},
			loader: {
				loaders: {
					/* loaders */
				}
			},
			popup: {
				popups: {
					/* popups */
				}
			}
		}),
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: PreloadAllModules
		})
	],
	providers: [
		/* providers */
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		AuthenticatedGuard,
		GuestGuard,
		AdminsGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
