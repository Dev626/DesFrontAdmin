import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { MDESCart, MDESMap, MDESProduct, MDESPurchase, MDESRegister, MDESRegisterCompany, MDESStore } from './view/mdes.core';

const ovmRoutes: Routes = [
	{ path: '', component: MDESMap },
	{ path: 'Purchase/:id', component: MDESPurchase },
	{ path: 'Store/:id', component: MDESStore },
	{ path: 'Store/:sid/Product/:pid', component: MDESProduct },
	{ path: 'Cart', component: MDESCart },
	{ path: 'Register', component: MDESRegister },
	{ path: 'RegisterCompany', component: MDESRegisterCompany },
    { path: 'Be', loadChildren: () => import('./ovb.module').then(m => m.OVBModule) }
];

export const ovmRouting: ModuleWithProviders<Route> = RouterModule.forRoot(ovmRoutes, { useHash: true }); 