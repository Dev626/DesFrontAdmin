import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	styleUrls: ['./dsh.sellerMapLocation.css'],
	selector: 'dsh-seller-map-location',
	templateUrl: './dsh.sellerMapLocation.html'
})
export class DSHSellerMapLocation {

	@Input() tienda : any = {};
	@Input() config : any = {};
	
	constructor(private modalService: NgbModal){
		
	}

	verMapa(modalMapa : any){
		this.modalService.open(modalMapa).result.then((result) => 
		{}, (reason) => {});
	}

}