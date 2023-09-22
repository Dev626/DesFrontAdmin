import { Component, AfterViewInit, OnInit, OnDestroy, Input } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { pDespedidoDetalleObtener, DESpedidoDetalleServiceJPO } from '../../service/des.dESpedidoDetalleService';
import { ActivatedRoute } from '@angular/router';
import { DESPedidoServiceJPO, pDespedidoEditarEstado } from '../../service/des.dESPedidoService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CoreService, FIRESMS, OHService } from '@ovenfo/framework';
import { Firestore } from 'firebase/firestore';

@Component({
	selector: 'des-shop-detail',
	styleUrls: ['./../../css/des.structure.css'],
	templateUrl: './des.shopDetail.html'
})
export class ShopDetail extends DESBase implements OnInit, AfterViewInit, OnDestroy {
	
    @Input() tipo_vista: string; // 'client' | 'seller'
	
	tienda : any = {}

	pedido : any = {}
	usuario_direccion : any = {}
	pedido_historial : any = []

	items : any = [];
	total : number = 0;

	pestana_activa : number = 1

	private dESpedidoDetalleService : DESpedidoDetalleServiceJPO;
	private dESPedidoService : DESPedidoServiceJPO;

	sms : FIRESMS

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private route: ActivatedRoute, private modalService: NgbModal, firestore: Firestore){
		super(ohService, cse, dcs);
		this.dESpedidoDetalleService = new DESpedidoDetalleServiceJPO(ohService);
		this.dESPedidoService = new DESPedidoServiceJPO(ohService);

		this.sms = new FIRESMS(firestore, environment.firebase_coleccion_base)
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
			if (params && params['id']) {
				this.pedido.pedido_id = Number(params['id']);
				this.despedidoDetalleObtener();
			}
		});

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	despedidoDetalleObtener(){
        this.dESpedidoDetalleService.despedidoDetalleObtener({
            pedido_id : this.pedido.pedido_id
        }, (resp : pDespedidoDetalleObtener) => {
			
			this.tienda = resp.tienda;
			this.tienda.longitud = Number(resp.tienda.longitud);
			this.tienda.latitud = Number(resp.tienda.latitud);	
		
			this.items = resp.productos
			this.pedido = resp.pedido

			console.log(resp.pedido)
			this.pedido_historial = resp.pedido_historial

			this.buscar_whatsapp_compartir_url = this.obtenerTienda(this.tienda.tienda_id)
			
			this.calcularTotal();
        });
	}
	
	calcularTotal(){
		let _total = 0;
		
		for(var i in this.items){
			this.items[i].sub_total = Math.round((this.items[i].cantidad*this.items[i].precio)*100)/100
			_total += (this.items[i].precio*this.items[i].cantidad)
		}
		this.total = Math.round(_total*100)/100;
	}

	confirmacion : any = {}
	confirmacion_estados = {
		'recepcionar' : this.dcs.config.estado_pedido.recepcionado,
		'cancelar' : this.dcs.config.estado_pedido.cancelado,
		'atender' : this.dcs.config.estado_pedido.atendido
	}

	ejecutar(tipo : string, modal : any){ // recepcionar | cancelar | atender
		this.confirmacion = {
			tipo : tipo,
			comentario : ""
		}
		this.modalService.open(modal).result.then((result) => {
		}, (reason) => {
		});
	}

	despedidoEditarEstado(c : any){
		this.dESPedidoService.despedidoEditarEstado({
			pedido_id : this.pedido.pedido_id, 
			estado : this.confirmacion_estados[this.confirmacion.tipo],
			comentario : this.confirmacion.comentario,
			usuario_modificacion_id : this.cse.data.user.data.userid
		}, (resp : pDespedidoEditarEstado) => {
			if (resp.resp_estado == 1) {

				let _estado = ""
				switch (this.confirmacion.tipo){
					case 'recepcionar' 	: _estado = "recepcionado"; break;
					case 'cancelar' 	: _estado = "cancelado"; break;
					case 'atender' 		: _estado = "atendido"; break;
				}
				

				if(this.pedido.telefono && this.pedido.usuario_id != this.cse.data.user.data.userid){

					let _url = ""
					if(this.pedido.usuario_id){
						_url = "#/Be/des/order/detail/"
					} else {
						_url = "/purchase/"
					}

					// Pedido recepcionado, cancelado, atendido sms al comprador
					this.sms.guardar({
						uid : this.ohService.getOH().getUtil().getUID(),
						mensaje : "Delivery Smart: Pedido Nro "+this.pedido.pedido_id+" ha sido "+_estado+" "+environment.protocol+"://"+environment.hostLocal+_url+this.pedido.pedido_id,
						numero : this.pedido.telefono,
						pais : this.dcs.data.un_config_format.prefijo_telefono,
						pendiente : true
					})

				}

				if(this.pedido.usuario_id == this.cse.data.user.data.userid && this.confirmacion.tipo == "cancelar"){

					let _tef = this.pedido.telefono ? "Tel "+this.pedido.telefono : ""

					// Pedido cancelado, sms al vendedor
					this.sms.guardar({
						uid : this.ohService.getOH().getUtil().getUID(),
						mensaje : "Delivery Smart: Pedido Nro "+this.pedido.pedido_id+" ha sido cancelado por "+this.pedido.cliente.substring(0, 20)+" "+_tef+" "+environment.protocol+"://"+environment.hostLocal+"/#/Be/des/seller/detail/"+this.pedido.pedido_id,
						numero : this.tienda.telefono,
						pais : this.dcs.data.un_config_format.prefijo_telefono,
						pendiente : true
					})

				}

				this.ohService.getOH().getAd().success(resp.resp_mensaje)
				this.despedidoDetalleObtener()
				c()
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getAd().error(resp.resp_mensaje)
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje)
				}
			}
		});	
	}

	imprimir(){
		window.scrollTo(0,0);
		window.print();
	}

	verUbicacion(modal : any){
		
	}

}
