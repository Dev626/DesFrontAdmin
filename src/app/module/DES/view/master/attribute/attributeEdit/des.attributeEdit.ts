import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { DESAtributoServiceJPO, pDesatributoRegistrar, pDesatributoObtener, pDesatributoEditar } from 'src/app/module/DES/service/des.dESAtributoService';
import { CoreService, OHService } from '@ovenfo/framework';


@Component({
	templateUrl: './des.attributeEdit.html'
})
export class AttributeEdit extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	item : any = {};

	private dESAtributoService : DESAtributoServiceJPO;

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private route: ActivatedRoute, private router: Router){
		super(ohService, cse, dcs);
		this.dESAtributoService = new DESAtributoServiceJPO(ohService);
		this.item = {
			estado : this.cse.params.estado.activo
		}
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
			if (params && params['id']) {
				this.item.atributo_id = Number(params['id']);
				this.desatributoObtener();
			}
		});
	}

	ngAfterViewInit(){

	}

	grabar(){
		this.ohService.getOH().getUtil().confirm("Confirma guardar los datos", () => {
			if(this.item.atributo_id){
				this.desatributoEditar();
			} else {
				this.desatributoRegistrar();
			}
		});
	}


	ngOnDestroy(){

	}

    desatributoRegistrar(){
        this.dESAtributoService.desatributoRegistrar({
			nombre : this.item.nombre,
            estado : this.item.estado,
            usuario_registro_id : this.cse.data.user.data.userid
        }, (resp : pDesatributoRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../'], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
	}

	desatributoObtener(){
        this.dESAtributoService.desatributoObtener({
            atributo_id : this.item.atributo_id
        }, (resp : pDesatributoObtener) => {
				this.item = resp;
        });
	}

	desatributoEditar(){
		this.dESAtributoService.desatributoEditar({
            atributo_id : this.item.atributo_id,
            nombre : this.item.nombre,
            estado : this.item.estado,
            usuario_modificacion_id : this.cse.data.user.data.userid
        }, (resp : pDesatributoEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
	}

}
