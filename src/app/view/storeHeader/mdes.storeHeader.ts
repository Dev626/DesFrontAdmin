import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: 'mdes-storeheader',
	templateUrl: './mdes.storeHeader.html'
})
export class MDESStoreHeader {
	
	@Input() tienda: any
	@Input() horarios: any
	@Input() medio_pago: any
	@Input() config: any
	
    constructor(private modalService: NgbModal){
		
	}

	verMedioPago(modalMedios){
		this.modalService.open(modalMedios);
	}

	verHorario(modalHorario){
		this.modalService.open(modalHorario);
	}

	formatHorario(hora){
		if(typeof(hora) == "number"){
			hora = {
				hour : (hora-hora%60)/60,
				minute : hora%60
			}
		}
		return (hora.hour > 9 ? hora.hour : '0'+hora.hour ) + ":" + (hora.minute > 9 ? hora.minute : '0'+hora.minute )
	}
	
}