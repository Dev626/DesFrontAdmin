import { Component } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.sellerDetail.html'
})
export class SellerDetail extends DESBase {
		
	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
		super(ohService, cse, dcs);
	}

}
