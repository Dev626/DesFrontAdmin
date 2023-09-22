import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DSHSellerMapLocation } from './components/sellerMapLocation/dsh.sellerMapLocation';

import { DSHHelp } from './components/help/dsh.help';
import { MapPlace } from './components/mapPlace/oh.mapPlace';
import { OHCore } from '@ovenfo/framework';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule, HttpClientModule, FormsModule,
		NgbModule,
		OHCore
	],
	declarations: [
		DSHSellerMapLocation, DSHHelp, MapPlace
	],
	exports: [
		DSHSellerMapLocation, DSHHelp, MapPlace
	],
	providers: [
	]
})

export class DSHShared {}