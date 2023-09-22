import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMessaging } from '@angular/fire/messaging';
import { provideAuth } from '@angular/fire/auth';
import { getMessaging } from '@firebase/messaging';
import { getAuth } from '@firebase/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { shared } from 'src/environments/environmentShared';
import { ovmRouting } from './ovm.routing';
import { CoreService, OHService, MainService, FirebaseAuthService, OHCore, OVCMessaging, TranslocoRootModule, ohObjDateFormat, ohObjDateFormatCustom } from '@ovenfo/framework';
import { OVMBody } from 'src/ovn/body/ovm.body';

import { MDESCart, MDESLogin, MDESMap, MDESNav, MDESProduct, MDESPurchase, MDESRegister, MDESRegisterCompany, MDESStore, MDESStoreHeader } from './view/mdes.core';
import { DSHShared } from './module/DES/module/dshShared/dsh.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CustomFormsModule } from 'ng2-validation';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    OVMBody,
    MDESLogin, MDESRegister, MDESRegisterCompany, MDESMap, MDESCart, MDESStore, MDESProduct, MDESPurchase, MDESNav, MDESStoreHeader
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    DSHShared,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),
    provideAuth(() => getAuth()),
    OHCore,
    TranslocoRootModule,
    ovmRouting,
    QRCodeModule,
    NgxCurrencyModule,
    NgxImageZoomModule,
    CustomFormsModule,
    CommonModule
  ],
  providers: [
    OHService,
    MainService,
    CoreService, { provide: 'cseEnvironment', useValue: environment } , { provide: 'cseShared', useValue: shared },
    { provide: ohObjDateFormat, useValue: ohObjDateFormatCustom },
    OVCMessaging,
    FirebaseAuthService
  ],
  bootstrap: [OVMBody]
})
export class OVMModule {}