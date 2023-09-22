import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { CoreService, OHService } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

import { DESTiendaServiceJPO, pDestiendaClienteObtener } from 'src/app/module/DES/service/des.dESTiendaService';
import { DESPedidoServiceImpJPO } from 'src/app/module/DES/service/des.dESPedidoServiceImp';
import { pDespedidoTiendaProductoFotoListar, pDespedidoTiendaProductoObtener } from 'src/app/module/DES/service/des.dESPedidoService';

@Component({
	templateUrl: './mdes.product.html',
	styleUrls: ['./mdes.product.css']
})
export class MDESProduct extends INLODESBase {

	private dESTiendaService : DESTiendaServiceJPO;
	private dESPedidoService : DESPedidoServiceImpJPO;
	whatsapp_compartirproducto_url : string

	producto : any = {};
	
	horarios : any;
	medio_pago : any;
	
	constructor(public override ohService: OHService, private title: Title, public override cse: CoreService, private route: ActivatedRoute, private router: Router) {

		super(ohService, cse)
		
		this.dESTiendaService = new DESTiendaServiceJPO(ohService);
		this.dESPedidoService = new DESPedidoServiceImpJPO(ohService);

	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params && params['sid']) {
				this.tienda.tienda_id  = Number(params['sid']);
				this.destiendaClienteObtener()
			}
			if (params && params['pid']) {
				this.producto.tienda_producto_id  = Number(params['pid']);
				this.despedidoTiendaProductoObtener()
				this.despedidoTiendaProductoFotoListar()
			}
		});
	}

	destiendaClienteObtener(){
        this.dESTiendaService.destiendaClienteObtener({
			unidad_negocio_id : this.cse.data.system.business_unit_id,
			usuario_id : null,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaClienteObtener) => {
			if(resp.tienda){
				if(resp.tienda.estado == this.cse.params.estado.activo){
					this.horarios = resp.horarios
					this.medio_pago = resp.pago
					this.tienda = resp.tienda
					this.tienda.longitud = Number(resp.tienda.longitud);
					this.tienda.latitud = Number(resp.tienda.latitud);
					this.carritoValidar();
				} else {
					this.ohService.getOH().getAd().warning("La tienda se encuentra inactiva");
					this.router.navigate(['/'], { relativeTo: this.route });
				}
			} else {
				this.ohService.getOH().getAd().warning("El código de la tienda es inválido");
				this.router.navigate(['/'], { relativeTo: this.route });
			}
        });
	}

	despedidoTiendaProductoObtener(){
        this.dESPedidoService.despedidoTiendaProductoObtener({
            tienda_producto_id : this.producto.tienda_producto_id
        }, (resp : pDespedidoTiendaProductoObtener) => {
			if(resp && resp.tienda_producto_id){

				this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Tienda Nro "+this.tienda.tienda_id+" - Producto "+resp.producto_nombre);

				this.producto = resp
				this.whatsapp_compartirproducto_url = this.obtenerProducto(this.tienda.tienda_id, resp.tienda_producto_id)

				if(this.carrito.find(it => it.tienda_producto_id == this.producto.tienda_producto_id)){
					this.producto['agregado'] = true;
				}
				
				this.mapHeader(resp.tienda_nombre.toUpperCase(), resp.producto_nombre+" "+resp.simbolo+" "+resp.precio, resp.url)

			} else {
				this.ohService.getOH().getAd().warning("El producto se encuentra inactivo");
				if(this.tienda.tienda_id){
					this.router.navigate(['../../'], { relativeTo: this.route });
				} else {
					this.router.navigate(['/'], { relativeTo: this.route });
				}
			}
        });
    }

	fotos : any
    despedidoTiendaProductoFotoListar(){
        this.dESPedidoService.despedidoTiendaProductoFotoListar({
            tienda_producto_id : this.producto.tienda_producto_id
        }, (resp : pDespedidoTiendaProductoFotoListar[]) => {
			this.fotos = resp
        });
    }

}