import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { pDestiendaComercianteObtener, pDestiendaComerciantePedidoListar, DESComercianteServiceJPO } from '../../service/des.dESComercianteService';

import { DESTiendaServiceJPO, pDestiendaListar } from '../../service/des.dESTiendaService';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.seller.html'
})
export class Seller extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	private dESComercianteService : DESComercianteServiceJPO;
	private dESTiendaService : DESTiendaServiceJPO;
	active = 1
	pedidos : any = [];
    public filter: any;
	public pagin: any;

	tiendas : any = [];
    public filterStore: any;
	public paginStore: any;
	
	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private route: ActivatedRoute, private router: Router){
		super(ohService, cse, dcs);
		this.dESComercianteService = new DESComercianteServiceJPO(ohService);
		this.dESTiendaService = new DESTiendaServiceJPO(ohService);
		this.destiendaComercianteObtener();

		this.precarga.then(() => {
			this.filtroTab()
			this.filtroTabStore()
		})
	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	filtroTab(){
        this.pagin = {
            page: 1,
            total: 0,
            size_rows: 10,
        };
        this.filter = {
            startList: false,
            field: {},
            fields: {
				estado : {
					label : "Estado",
					type : "",
					closeFilter : true,
					beforeFilter : (estado : any) => {
						let un = this.dcs.data.catalogo.estado_pedido.find(it => it.id == estado.value);
                        if (un) {
                            estado.descValue = un.descripcion;
                        }
					}
				},
				pedido_id : {
					label : "Nro pedido",
					type : "",
					closeFilter : true
				},
				tienda_nombre : {
					label : "Tienda",
					type : "",
					closeFilter : true
				},
				cliente : {
					label : "Cliente",
					type : "",
					closeFilter : true
				}
            }
        };
	}

	filtroTabStore(){
        this.paginStore = {
            page: 1,
            total: 0,
            size_rows: 10,
        };
        this.filterStore = {
            startList: false,
            field: {},
            fields: {
				tienda_id : {
					label : "Nro tienda",
					type : "",
					closeFilter : true
				},
				tienda_nombre : {
					label : "Tienda",
					type : "",
					closeFilter : true
				},
				propietario : {
					label : "Propietario",
					type : "",
					closeFilter : true
				}
            }
        };
	}

	destiendaComercianteObtener(){
        this.dESComercianteService.destiendaComercianteObtener({
			usuario_id : this.cse.data.user.data.userid,
        }, (resp : pDestiendaComercianteObtener) => {
			if(!this.cse.tieneRol(['des_admin']) && resp.total == 0){
				this.storage.add("OVN_DES_DATA", "SELLER_NEW", {
					tiendas : resp.total,
					razon_comercial : resp.razon_comercial
				})
				this.router.navigate(['storenew'], { relativeTo: this.route });
			}
        });
	}
	
	destiendaComerciantePedidoListar(){
        this.dESComercianteService.destiendaComerciantePedidoListar({
            usuario_id :this.cse.data.user.data.userid,
			estado : this.filter.fields.estado.value,
			pedido_id : this.filter.fields.pedido_id.value,
			tienda_nombre : this.filter.fields.tienda_nombre.value,
			cliente : this.filter.fields.cliente.value,
			page: this.pagin.page,
			size: this.pagin.size_rows
        }, (resp : pDestiendaComerciantePedidoListar) => {
			this.pagin.total = resp.response.total_registros
			this.pedidos = resp.pedidos;
			for(var i in this.pedidos){
				this.pedidos[i].fecha_detalle = this.ohService.getOH().getUtil().getDateDesc(resp.response.fecha_actual, this.pedidos[i].fecha_registro);
			}
        });
	}
	
	destiendaListar(){
        this.dESTiendaService.destiendaListar({
            usuario_id :this.cse.data.user.data.userid,
			tienda_id : this.filterStore.fields.tienda_id.value,
			tienda_nombre : this.filterStore.fields.tienda_nombre.value,
			propietario : this.filterStore.fields.propietario.value,
			page: this.paginStore.page,
			size: this.paginStore.size_rows
        }, (resp : pDestiendaListar) => {
			this.paginStore.total = resp.response.total
			this.tiendas = resp.tiendas;
        });
    }

}