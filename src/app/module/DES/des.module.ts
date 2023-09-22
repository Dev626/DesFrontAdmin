import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';

import { SellerMapLocation } from './components/sellerMapLocation/des.sellerMapLocation';
import { ShopDetail } from './components/shopDetail/des.shopDetail';
import { Help } from './components/help/des.help';
import { DSHShared } from './module/dshShared/dsh.module';
import { OHCore, OVCCanActivateModule } from '@ovenfo/framework';

import { QRCodeModule } from 'angularx-qrcode';
import { NgxCurrencyModule } from 'ngx-currency';

import { routing } from './des.routing';
import { DESCoreService } from './des.coreService';
import { DESMain, Master, Category, Attribute, OrderDetail, SellerDetail, Order, Seller, CategoryEdit, AttributeEdit, Storeedit, Banner, BannerNew } from './view/des.core';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxTinymceModule } from 'ngx-tinymce';

@NgModule({
    imports: [
        routing,
    NgbModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/'
    }),
        CommonModule, HttpClientModule, FormsModule, CustomFormsModule, OHCore,
        NgxCurrencyModule, QRCodeModule,
        TranslocoModule,
        DSHShared
    ],
    declarations: [
		SellerMapLocation, ShopDetail, Help, DESMain, Master, Category, Attribute, OrderDetail, SellerDetail, Order, Seller, CategoryEdit, AttributeEdit, Storeedit, Banner, BannerNew
    ],
    providers: [DESCoreService, OVCCanActivateModule, { provide: TRANSLOCO_SCOPE, useValue: 'des' }]
})
export class DESModule {}
