import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { DESMain, Master, Category, Attribute, OrderDetail, SellerDetail, Order, Seller, CategoryEdit, AttributeEdit, Storeedit, Banner, BannerNew } from './view/des.core';

import { OVCCanActivateModule } from '@ovenfo/framework';

const routes: Routes = [
	{ path: '', component: DESMain },
	{ path: 'master', component: Master, canActivate: [OVCCanActivateModule] },
	{ path: 'master/category', component: Category, canActivate: [OVCCanActivateModule] },
	{ path: 'master/attribute', component: Attribute, canActivate: [OVCCanActivateModule] },
	{ path: 'seller/detail/:id', component: SellerDetail, canActivate: [OVCCanActivateModule] },
	{ path: 'seller', component: Seller, canActivate: [OVCCanActivateModule] },
	{ path: 'order', component: Order, canActivate: [OVCCanActivateModule] },
	{ path: 'order/detail/:id', component: OrderDetail, canActivate: [OVCCanActivateModule] },
	{ path: 'master/category/new', component: CategoryEdit, canActivate: [OVCCanActivateModule] },
	{ path: 'master/category/edit/:id', component: CategoryEdit, canActivate: [OVCCanActivateModule] },
	{ path: 'master/attribute/new', component: AttributeEdit, canActivate: [OVCCanActivateModule] },
	{ path: 'master/attribute/edit/:id', component: AttributeEdit, canActivate: [OVCCanActivateModule] },
	{ path: 'seller/storenew', component: Storeedit, canActivate: [OVCCanActivateModule] },
  { path: 'seller/storeedit/:id', component: Storeedit, canActivate: [OVCCanActivateModule] },
  { path: 'master/banner', component: Banner, canActivate: [OVCCanActivateModule] },
  { path: 'master/banner/bannernew', component: BannerNew, canActivate: [OVCCanActivateModule] },
  { path: 'master/banner/banneredit/:id', component: BannerNew, canActivate: [OVCCanActivateModule] },
];

export const routing: ModuleWithProviders<Route> = RouterModule.forChild(routes);
