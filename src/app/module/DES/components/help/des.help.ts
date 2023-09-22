import { Component } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	styleUrls: ['./des.help.css'],
	selector: 'des-help',
	templateUrl: './des.help.html'
})
export class Help extends DESBase {

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
		super(ohService, cse, dcs);
	}

}