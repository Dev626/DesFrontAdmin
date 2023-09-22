import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { DESAtributoServiceJPO, pDesatributoListar } from '../../../service/des.dESAtributoService';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.attribute.html'
})
export class Attribute extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	private dESAtributoService : DESAtributoServiceJPO;
	
	items : any = [];
	
	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
		super(ohService, cse, dcs);
		this.dESAtributoService = new DESAtributoServiceJPO(ohService);
		this.desatributoListar()
	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	desatributoListar(){
        this.dESAtributoService.desatributoListar({
        }, (resp : pDesatributoListar) => {
			this.items = resp.atributos
		
        });
    }

}
