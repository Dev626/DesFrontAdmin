import { Component, Input } from '@angular/core';

@Component({
	styleUrls: ['./dsh.help.css'],
	selector: 'dsh-help',
	templateUrl: './dsh.help.html'
})
export class DSHHelp {

	@Input() config : any = {};
	
	constructor(){
	}

}