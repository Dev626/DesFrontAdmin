import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CoreService, OHService } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

import { DESPedidoServiceImpJPO } from 'src/app/module/DES/service/des.dESPedidoServiceImp';
import { pDespedidoClienteBuscar } from 'src/app/module/DES/service/des.dESPedidoService';

@Component({
	templateUrl: './mdes.map.html',
	styleUrls: ['./mdes.map.css']
})
export class MDESMap extends INLODESBase {

	private dESPedidoService : DESPedidoServiceImpJPO;

	buscar : any = {}
	buscar_zoom : number = 15
	_pedidoService : any

	constructor(public override ohService: OHService, private title: Title, public override cse: CoreService, private modalService: NgbModal) {

		super(ohService, cse)
		
		this.dESPedidoService = new DESPedidoServiceImpJPO(ohService);

		this.precarga.then(() => {
			this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Mapa");
			this.inicializar()
		})

	}

	ngOnInit() {
	}

	inicializar(){
				
		this.buscar.filtrar = {
			distancia : 7
		}
		this.buscar.filtro = {
			distancia : 7
		} 
		this.buscar.latitud = Number(this.config.defecto.gps_latitude)
		this.buscar.longitud = Number(this.config.defecto.gps_longitude)

		this.buscar.ubicacion_marcador = "https://firebasestorage.googleapis.com/v0/b/apm-inland.appspot.com/o/marker_selected_tiny.png?alt=media&token=fb36f55d-e837-40ec-b279-50dd1e1bfd9d"

		this.ubicarGPS();
	}

	ubicarGPS(){
		
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

	despedidoClienteBuscar(call ?: any){

		var clienteBuscar = this.dESPedidoService.despedidoClienteBuscar({
			unidad_negocio_id 		: this.cse.data.system.business_unit_id,
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
		});

		this._pedidoService = clienteBuscar.subscribe((data) => {
			
		})

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

	seleccionarTienda($event){
		
		if(this.buscar.filtro.tienda_buscada){

			//this.buscar.tiendas = [this.buscar.filtro.tienda_buscada]

			//console.log(this.buscar.filtro.tienda_buscada)

			this.tiendaSeleccionar(this.buscar.filtro.tienda_buscada)

			this.despedidoClienteBuscar(true)

		}
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

	onBuscarTienda(midata){
		midata((tienda_nombre) => {
			return this.dESPedidoService.despedidoClienteBuscar({
				unidad_negocio_id 		: this.cse.data.system.business_unit_id,
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

	cerrarVentana(){
		this.buscar.tienda = null
		this.buscar.tienda_seleccionada = null
		this.buscar.filtro.tienda_buscada = null
	}

	/*
	countryChange($event){
		this.buscar.tiendas = []
		this.cambiarPais($event, () => {
			this.inicializar()
		})
	}
*/
}