import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { pDespedidoClienteListar, pDespedidoClienteBuscar } from '../../service/des.dESPedidoService';

import { environment } from 'src/environments/environment';
import { DESCategoriaServiceJPO, pDescategoriaListar } from '../../service/des.dESCategoriaService';
import { DESTiendaFavoritaServiceJPO, pDestiendaFavoritaListar, pDestiendaFavoritaEliminar } from '../../service/des.dESTiendaFavoritaService';
import { DESPedidoServiceImpJPO } from '../../service/des.dESPedidoServiceImp';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	styleUrls: ['./../../css/des.structure.css'],
	templateUrl: './des.order.html'
})
export class Order extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	private dESPedidoService : DESPedidoServiceImpJPO;
	private dESTiendaFavoritaService : DESTiendaFavoritaServiceJPO;
	private dESCategoriaService : DESCategoriaServiceJPO;
	
    public filter: any;
	public pagin: any;

	@ViewChild("modalDireccion", { static: true }) modalDireccion: NgbModalRef;
	
	items : any = [];
	tiendas : any =[];
	active = 1;

	buscar_zoom : number = 15

	env : string = ""

	public mapStyles = [
		{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
		  {
			"visibility": "off"
		  }
		  ]
		}
	  ];

	carritos : any = {}

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private modalService: NgbModal){
		super(ohService, cse, dcs);

		this.dESPedidoService = new DESPedidoServiceImpJPO(ohService);
		this.dESTiendaFavoritaService = new DESTiendaFavoritaServiceJPO(ohService);
		this.dESCategoriaService = new DESCategoriaServiceJPO(ohService);
		this.env = environment.env;
		
        this.precarga.then(() => {
			this.filtroTab()
		})

		this.descategoriaListar();

		let _carritos = this.storage.get("OVN_DES_CART") || {}

		this.carritos = []
		for(var i in _carritos){
			if(typeof(_carritos[i]) == 'object'){
				this.carritos.push(_carritos[i])
			}
		}

		if(this.carritos.length > 0){
			this.active = 4
		}


	}

	ngOnInit(){	
		this.destiendaFavoritaListar();
	}

	ngAfterViewInit(){

		if(this.carritos.length > 0){
			this.ohService.getOH().getAd().success("Tienes carritos pendientes a comprar !")
		}
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

	buscar : any = {}
	buscarTienda(modalUbicar : any, event: MouseEvent) {
		event.preventDefault();
		
		this.buscar.filtrar = {
			distancia : 3
		}
		this.buscar.filtro = {
			distancia : 3
		} 
		this.buscar.latitud = this.dcs.data.un_config_format.default_gps_latitude
		this.buscar.longitud = this.dcs.data.un_config_format.default_gps_longitude
		this.buscar.ubicacion_marcador = "https://firebasestorage.googleapis.com/v0/b/apm-inland.appspot.com/o/marker_selected_tiny.png?alt=media&token=fb36f55d-e837-40ec-b279-50dd1e1bfd9d"

		this.buscar.busqueda = [
			{
				tienda_id : 1,
				nombre : "San Juan",
				distancia : 30
			},
			{
				tienda_id : 2,
				nombre : "San Pedro",
				distancia : 40
			}
		]

		this.ubicarGPS(null);

		this.modalService.open(modalUbicar, { size: 'xl', backdrop : 'static' }).result.then((result) => {
			//this._pedidoService.unsubscribe()
		}, (reason) => {
			
		});


	}

	ubicarGPS(agpMap : any){ // PENDING
		
		if(agpMap){
		}

		var geo_options = {
			enableHighAccuracy: true, 
			maximumAge        : 4000, 
			timeout           : 3000
		};
		if(navigator.geolocation) {
			var wpid = navigator.geolocation.watchPosition((position) => {
				if(position.coords){
					this.buscar.latitud_encontrado = position.coords.latitude
					this.buscar.longitud_encontrado = position.coords.longitude

					
					this.buscar.latitud = position.coords.latitude + 0.0000000000009
					this.buscar.longitud = position.coords.longitude + 0.0000000000009
					setTimeout(() => {
						this.buscar.latitud = position.coords.latitude
						this.buscar.longitud = position.coords.longitude
					})

					this.buscar_zoom = 15
					this.buscar.tienda_seleccionada = null
				}
				this.despedidoClienteBuscar()
				navigator.geolocation.clearWatch(wpid);
				this.buscar.gps_habilitado = true
			}, (error : any) => {
				if(error.code == 1){
					this.buscar.gps_habilitado = false
					this.ohService.getOH().getAd().warning("Debe activar su posición GPS") // User denied Geolocation
					this.despedidoClienteBuscar()
				}
			}, geo_options);
		}
	}

	_pedidoService : any

	despedidoClienteBuscar(call ?: any){

		var clienteBuscar = this.dESPedidoService.despedidoClienteBuscar({
			unidad_negocio_id 		: this.cse.data.user.profile,
			latitud 				: this.buscar.latitud,
			longitud 				: this.buscar.longitud,
			distancia 				: this.buscar.filtro.distancia,
			tienda_nombre 			: this.buscar.filtro.tienda_nombre,
			indicador_disponible 	: this.buscar.filtro.indicador_disponible,
			categoria_id 			: this.buscar.filtro.categoria_id
		}, (resp : pDespedidoClienteBuscar[]) => {
			let _resp : any = resp
			for(var i in _resp){
				_resp[i].latitud = Number(_resp[i].latitud)
				_resp[i].longitud = Number(_resp[i].longitud)
			}
			this.buscar.tiendas = _resp
			if(call){
				call()
			}
		});

		this._pedidoService = clienteBuscar.subscribe((data) => {
			
		})

	}
	
	tiendaSeleccionar(tienda : any){
		
		this.buscar.latitud = tienda.latitud
		this.buscar.longitud = tienda.longitud

		this.buscar.tienda_seleccionada = tienda.tienda_id

		this.buscar_zoom = 17

		setTimeout(() => {
			this.buscar.tienda = tienda
		})

	}

	desvincular(e, tienda_id : any, index : number){
		e.preventDefault();
		e.stopPropagation();
		this.ohService.getOH().getUtil().confirm("¿Confirma quitar de favoritos la tienda seleccionada?", () => {
			this.dESTiendaFavoritaService.destiendaFavoritaEliminar({
				usuario_id : this.cse.data.user.data.userid,
				tienda_id : tienda_id
			}, (resp : pDestiendaFavoritaEliminar) => {
			});
			this.ohService.getOH().getAd().warning("Se quitó de favoritos");
			this.tiendas.splice(index, 1)
		})
	}

	despedidoClienteListar(){
        this.dESPedidoService.despedidoClienteListar({
            usuario_id :this.cse.data.user.data.userid,
			estado : this.filter.fields.estado.value,
			pedido_id : this.filter.fields.pedido_id.value,
			tienda_nombre : this.filter.fields.tienda_nombre.value,
			cliente : this.filter.fields.cliente.value,
			page: this.pagin.page,
			size: this.pagin.size_rows
        }, (resp : pDespedidoClienteListar) => {
			this.pagin.total = resp.response.total
			this.items = resp.listapedidos
			for(var i in this.items){
				this.items[i].fecha_detalle = this.ohService.getOH().getUtil().getDateDesc(resp.response.fecha_actual, this.items[i].fecha_registro);
			}
        });
	}

	destiendaFavoritaListar(){
        this.dESTiendaFavoritaService.destiendaFavoritaListar({
            usuario_id : this.cse.data.user.data.userid
        }, (resp : pDestiendaFavoritaListar[]) => {
			this.tiendas = resp
        });
	}

	seleccionarTienda($event){
		//console.log($event)
		//console.log(this.buscar.filtro.tienda_buscada)
		if(this.buscar.filtro.tienda_buscada){

			this.buscar.latitud = this.buscar.filtro.tienda_buscada.latitud
			this.buscar.longitud = this.buscar.filtro.tienda_buscada.longitud

			this.despedidoClienteBuscar(() => {
				this.tiendaSeleccionar(this.buscar.filtro.tienda_buscada)
			})

		}
	}

	cerrarVentana(){
		this.buscar.tienda = null
		this.buscar.tienda_seleccionada = null
		this.buscar.filtro.tienda_buscada = null
	}

	onBuscarTienda(midata){
		midata((tienda_nombre) => {
			return this.dESPedidoService.despedidoClienteBuscar({
				unidad_negocio_id 		: this.cse.data.user.profile,
				latitud 				: this.buscar.latitud,
				longitud 				: this.buscar.longitud,
				distancia 				: this.buscar.filtro.distancia,
				tienda_nombre 			: tienda_nombre,
				indicador_disponible 	: this.buscar.filtro.indicador_disponible,
				categoria_id 			: this.buscar.filtro.categoria_id
			}, (resp : pDespedidoClienteBuscar[]) => {
				let _resp : any = resp
				for(var i in _resp){
					_resp[i].latitud = Number(_resp[i].latitud)
					_resp[i].longitud = Number(_resp[i].longitud)
				}
				return _resp
			})
		})
	}

	limpiarBusqueda(){

	}

	mapaClick($event){
		if($event.coords){
			this.buscar.latitud = $event.coords.lat
			this.buscar.longitud = $event.coords.lng
			this.buscar.latitud_encontrado = $event.coords.lat
			this.buscar.longitud_encontrado = $event.coords.lng
			this.buscar.tienda_seleccionada = null
		}
		this.despedidoClienteBuscar()
	}

	filtrar(modalFiltro){
		this.modalService.open(modalFiltro).result.then((result) => {
			if(result == "doFilter"){
				this.buscar.filtro = JSON.parse(JSON.stringify(this.buscar.filtrar))
				this.buscar.tienda_seleccionada = null
				if(this.buscar.filtro.distancia == 1){
					this.buscar_zoom = 16.5
				}

				if(this.buscar.filtro.distancia == 3){
					this.buscar_zoom = 15
				}

				if(this.buscar.filtro.distancia == 7){
					this.buscar_zoom = 13.5
				}

				if(this.buscar.filtro.distancia == 70){
					this.buscar_zoom = 10.7
				}

				this.buscar.latitud = this.buscar.latitud_encontrado + 0.0000000000009
				this.buscar.longitud = this.buscar.longitud_encontrado + 0.0000000000009
				setTimeout(() => {
					this.buscar.latitud = this.buscar.latitud_encontrado
					this.buscar.longitud = this.buscar.longitud_encontrado
				})
				

				this.despedidoClienteBuscar()
			}
		}, (reason) => {
			
		});
	}

	descategoriaListar(){
        this.dESCategoriaService.descategoriaListar({
            estado : this.cse.params.estado.activo,
        }, (resp : pDescategoriaListar) => {
			this.buscar.categorias = resp.categorias
        });
	}
	
	marcarTienda(tienda : any){
		this.storage.add("OVN_DES_CART", "defecto", tienda.tienda_id);
	}

}

