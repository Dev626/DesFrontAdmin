import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.master.html'
})
export class Master extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
		super(ohService, cse, dcs);
	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

}
