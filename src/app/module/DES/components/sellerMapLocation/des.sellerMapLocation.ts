import { Component, Input } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	styleUrls: ['./../../css/des.structure.css'],
	selector: 'des-seller-map-location',
	templateUrl: './des.sellerMapLocation.html'
})
export class SellerMapLocation extends DESBase {

	@Input() tienda : any = {};

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private modalService: NgbModal){
		super(ohService, cse, dcs);
	}

	verMapa(modalMapa : any){
		this.modalService.open(modalMapa).result.then((result) => 
		{}, (reason) => {});
	}

}