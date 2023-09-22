import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CoreService, OHService } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

import { pDespedidoTiendaProductoListar } from 'src/app/module/DES/service/des.dESPedidoService';
import { DESTiendaServiceJPO, pDestiendaClienteObtener } from 'src/app/module/DES/service/des.dESTiendaService';
import { DESTiendaFavoritaServiceJPO, pDestiendaFavoritaEliminar, pDestiendaFavoritaObtener, pDestiendaFavoritaRegistrar } from 'src/app/module/DES/service/des.dESTiendaFavoritaService';
import { DESPedidoServiceImpJPO } from 'src/app/module/DES/service/des.dESPedidoServiceImp';

@Component({
	templateUrl: './mdes.store.html',
	styleUrls: ['./mdes.store.css']
})
export class MDESStore extends INLODESBase {

	private dESTiendaService : DESTiendaServiceJPO;
	private dESTiendaFavoritaService : DESTiendaFavoritaServiceJPO;
	private dESPedidoService : DESPedidoServiceImpJPO;
	whatsapp_compartirtienda_url : string

	horarios : any;
	medio_pago : any;
	productos : any = [];
	
	public pagin: any;
	producto_buscar : string

	es_tienda_favorita : boolean

	constructor(public override ohService: OHService, private title: Title, public override cse: CoreService, private route: ActivatedRoute, private router: Router) {

		super(ohService, cse)
				
		this.dESTiendaService = new DESTiendaServiceJPO(ohService);
		this.dESTiendaFavoritaService = new DESTiendaFavoritaServiceJPO(ohService);
		this.dESPedidoService = new DESPedidoServiceImpJPO(ohService);

		this.filtroTab()

	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params && params['id']) {
				this.tienda.tienda_id  = Number(params['id']);
				this.destiendaClienteObtener();
				this.despedidoTiendaProductoListar();

				if(this.cse.data.user){
					this.destiendaFavoritaObtener()
				}
			}
		});
	}

	onLoginoutEvent(){
		this.dESTiendaFavoritaService = new DESTiendaFavoritaServiceJPO(this.ohService);
		if(this.cse.data.user){
			this.destiendaFavoritaObtener()
		}
	}

	filtroTab(){
        this.pagin = {
            page: 1,
            total: 0,
            size_rows: 30,
        };
	}

	destiendaClienteObtener(){
        this.dESTiendaService.destiendaClienteObtener({
			unidad_negocio_id : this.cse.data.system.business_unit_id,
			usuario_id : null,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaClienteObtener) => {
			if(resp.tienda){
				if(resp.tienda.estado == this.cse.params.estado.activo){

					this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Tienda Nro "+resp.tienda.tienda_id+" - "+resp.tienda.nombre);

					this.horarios = resp.horarios
					this.medio_pago = resp.pago
					this.tienda = resp.tienda
					this.tienda.longitud = Number(resp.tienda.longitud);
					this.tienda.latitud = Number(resp.tienda.latitud);
					this.whatsapp_compartirtienda_url = this.obtenerTienda(resp.tienda.tienda_id)
					this.carritoValidar();
					this.mapHeader(resp.tienda.nombre, "TIENDA DE "+resp.tienda.categoria_nombre.toUpperCase(), resp.tienda.empresa_logo_url)
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
	
	productos_cargando : boolean = false
	despedidoTiendaProductoListar(busquedaInicial ?: boolean){

		if(busquedaInicial){

			if(this.producto_buscar){

				let _buscar = this.producto_buscar.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

				this.productos = this.productos.filter(it => 
					it.producto_nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(_buscar) >= 0 ||
					(it.producto_descripcion && it.producto_descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(_buscar) >= 0)
				)

			} else {
				this.productos = []
			}

			this.pagin.page = 1
		}

		this.producto_buscar = this.producto_buscar ? this.producto_buscar.trim() : null
		this.productos_cargando = true
        this.dESPedidoService.despedidoTiendaProductoListar({
			tienda_id : this.tienda.tienda_id,
			nombre : this.producto_buscar,
			page :  this.pagin.page,
			size :  this.pagin.size_rows
        }, (resp : pDespedidoTiendaProductoListar) => {

			this.pagin.total = resp.resultado.total
			let _productos = resp.productos

			for(var i in _productos){
				if(this.carrito.find(it => it.tienda_producto_id == _productos[i].tienda_producto_id)){
					_productos[i]['agregado'] = true;
				}
			}

			if(busquedaInicial){
				this.productos = _productos
			} else {
				this.productos = this.productos.concat(_productos)
			}
			
			this.productos_cargando = false
        });
	}

	destiendaFavoritaObtener(){
        this.dESTiendaFavoritaService.destiendaFavoritaObtener({
            usuario_id : this.cse.data.user.data.userid,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaFavoritaObtener) => {
			if(resp && resp.tienda_id && resp.tienda_id == this.tienda.tienda_id){
				this.es_tienda_favorita = true
			}
        });
    }
	
	destiendaFavoritaRegistrar(){
        this.dESTiendaFavoritaService.destiendaFavoritaRegistrar({
            usuario_id : this.cse.data.user.data.userid,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaFavoritaRegistrar) => {
		});
		this.es_tienda_favorita = true
		this.ohService.getOH().getAd().success("Agregado como favorito");
	}
	
	destiendaFavoritaEliminar(){
        this.dESTiendaFavoritaService.destiendaFavoritaEliminar({
            usuario_id : this.cse.data.user.data.userid,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaFavoritaEliminar) => {
		});
		this.es_tienda_favorita = false
		this.ohService.getOH().getAd().success("Se quitó de favoritos");
	}

	@HostListener('window:scroll', ['$event'])
	onResize(event) {
		let downsize = document.body.offsetHeight - window.innerHeight
		if(downsize - window.scrollY <= 400 && !this.productos_cargando && this.pagin.total){
			if(this.pagin.page+1 <= Math.ceil(this.pagin.total/this.pagin.size_rows)){
				this.pagin.page++;
				this.despedidoTiendaProductoListar()
			}
		}
	}

	buscarProductos(){
		this.despedidoTiendaProductoListar(true)
	}

	limpiarProductos(){
		this.producto_buscar = null
		this.despedidoTiendaProductoListar(true)
	}

}