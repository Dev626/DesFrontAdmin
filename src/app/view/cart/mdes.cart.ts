import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Firestore } from 'firebase/firestore';
import { CoreService, FIRESMS, OHService } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

import { DESPedidoServiceJPO, pDespedidoRegistrar } from 'src/app/module/DES/service/des.dESPedidoService';
import { DESTiendaServiceJPO, pDestiendaClienteObtener } from 'src/app/module/DES/service/des.dESTiendaService';
import { ADMUsuarioDireccionServiceJPO, pGesusuarioDireccionEditar, pGesusuarioDireccionListar, pGesusuarioDireccionRegistrar } from 'src/app/module/ADM/service/adm.aDMUsuarioDireccionService';
import { DESUsuarioServiceJPO, pDesusuarioDireccionListar } from 'src/app/module/DES/service/des.dESUsuarioService';

import { MDESNav } from '../nav/mdes.nav';
import { environment } from 'src/environments/environment';

@Component({
	templateUrl: './mdes.cart.html',
	styleUrls: ['./mdes.cart.css']
})
export class MDESCart extends INLODESBase {

	@ViewChild('modalLugarMetodo', { static: true }) modalLugarMetodo : ElementRef;
	@ViewChild('modalDireccion', { static: true }) modalDireccion : ElementRef;
	@ViewChild('modalSeleccionarUsuario', { static: true }) modalSeleccionarUsuario : ElementRef;

	private dESPedidoService : DESPedidoServiceJPO;
	private dESTiendaService : DESTiendaServiceJPO;
	private aDMUsuarioDireccionService : ADMUsuarioDireccionServiceJPO;
	private dESUsuarioService : DESUsuarioServiceJPO;

	//tienda : any = {};
	medio_pago : any = {}
	horarios : any = {}
	
	//carrito : any = [];
	total : number = 0;

	usuario_direcciones : any = []

	pedido : any = {}

	navActivo : number = 1

	sms : FIRESMS

	constructor(public override ohService: OHService, private title: Title, public override cse: CoreService, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, firestore: Firestore) {

		super(ohService, cse)
		
		this.dESTiendaService = new DESTiendaServiceJPO(ohService);
		this.dESPedidoService = new DESPedidoServiceJPO(ohService);
		this.aDMUsuarioDireccionService = new ADMUsuarioDireccionServiceJPO(ohService);
		this.dESUsuarioService = new DESUsuarioServiceJPO(ohService);

		this.sms = new FIRESMS(firestore, environment.firebase_coleccion_base)
		
		let tienda_defecto_id = this.storage.item("OVN_DES_CART", "defecto");

		if(tienda_defecto_id){
			this.tienda.tienda_id = tienda_defecto_id;
			this.destiendaObtener();
			this.obtenerCarrito();
		}

		this.precarga.then(() => {
			this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Carrito");
		})

	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	private obtenerCarrito(){
		let carritos = this.storage.get("OVN_DES_CART") || {};
		let carro_tienda = carritos[this.tienda.tienda_id];
		if(carro_tienda){
			this.carrito = carro_tienda.productos;
		}
		for(var i in this.carrito){
			if(!this.carrito[i].cantidad){
				this.carrito[i].cantidad = 1
			}
		}
		this.calcularTotal();
	}

	calcularTotal(){
		let _total = 0;
		for(var i in this.carrito){
			this.carrito[i].sub_total = Math.round((this.carrito[i].cantidad*this.carrito[i].precio)*100)/100
			_total += (this.carrito[i].precio*this.carrito[i].cantidad)
		}
		this.total = Math.round(_total*100)/100;
		this.actualizarCarrito()
	}

	private actualizarCarrito(){
		let carritos = this.storage.get("OVN_DES_CART") || {};
		let carro_tienda = carritos[this.tienda.tienda_id];
		if(carro_tienda){
			carro_tienda.productos = this.carrito
		}
		carritos[this.tienda.tienda_id] = carro_tienda

		this.storage.set("OVN_DES_CART", carritos)
	}

	pendienteLoguear : boolean

	descripcion : string = ""

	pedirModal(desNav : MDESNav){
		if(this.cse.data.user){
			this.alAbrirModal()
			this.gesusuarioDireccionListar()
		} else {
			desNav.abrirModal()
			this.pendienteLoguear = true
		}
	}

	pedirContinuar(){
		let _cant = this.carrito.filter(it => it.cantidad < 1)
		if(_cant && _cant.length > 0){
			this.ohService.getOH().getAd().warning("Ingres una cantidad correcta");
			return
		}

		this.pedido = {
			tipo_entrega : 1,
			direccion : {}
		}
		this.descripcion = ""



		this.modalService.open(this.modalLugarMetodo, { size: 'xl' }).result.then((result) => {
		}, (reason) => {
			
		});
	}

	pedir(c : any){
		this.despedidoRegistrar(c);
	}

	homologar(productos : any){ // [{"tienda_producto_id":24,"precio_real":2.88,"stock_disponible":2}]
		let _carrito = []
		for(var i in this.carrito){
			let producto = productos.find(it => it.tienda_producto_id == this.carrito[i].tienda_producto_id)
			if(producto){

				this.carrito[i].precio = producto.precio_real

				if(producto.indicador_stock == '1' && producto.stock_disponible > 0){ // stock disponible se mantienen los otros se quitan
					this.carrito[i].stock_disponible = producto.stock_disponible
					this.carrito[i].cantidad = producto.stock_disponible
					_carrito.push(this.carrito[i])
				}

				if(producto.indicador_stock == '0'){
					_carrito.push(this.carrito[i])
				}
				
			}
		}
		this.carrito = _carrito
		this.calcularTotal()
	}

	despedidoRegistrar(c : any){
        this.dESPedidoService.despedidoRegistrar({
            tienda_id : this.tienda.tienda_id,
			usuario_registro_id : this.cse.data.user.data.userid,
			pedido_detalle : this.obtenerDetalle(),
			usuario_direccion_id : this.pedido.tipo_entrega == 1 ? this.pedido.usuario_direccion_id : null,
			medio_pago : this.pedido.medio_pago,
			monto_efectivo : this.pedido.monto_efectivo,
			tarjeta_id : this.pedido.tarjeta_id,
			banco_id : this.pedido.banco_id,
			billetera_id : this.pedido.billetera_id,
			descripcion : this.pedido.descripcion,
			usuario_id : this.tienda.pedido_local ? this.pedido.usuario_id : this.cse.data.user.data.userid,
			tipo_entrega : this.pedido.tipo_entrega,
			tipo_atencion : this.tienda.pedido_local ? '2' : '1',
			usuario_nombres : this.tienda.pedido_local ? this.pedido.usuario_nombres : null,
			usuario_apellido_paterno : this.tienda.pedido_local ? this.pedido.usuario_apellido_paterno : null,
			usuario_direccion : (this.tienda.pedido_local && this.pedido.direccion) ? this.pedido.direccion.direccion : null,
			usuario_longitud : (this.tienda.pedido_local && this.pedido.direccion) ? this.pedido.direccion.longitud : null,
			usuario_latitud : (this.tienda.pedido_local && this.pedido.direccion) ? this.pedido.direccion.latitud : null,
			usuario_telefono : this.pedido.tipo_entrega == 2 ? this.pedido.usuario_telefono : ((this.tienda.pedido_local) ? this.pedido.usuario_telefono : null)
        }, (resp : pDespedidoRegistrar) => {
			if (resp.resp_estado == 1) {
				c()

				let _usuario_telefono = ""
				let _usuario_nombre = ""

				if(this.tienda.pedido_local){

					_usuario_nombre += this.pedido.usuario_nombres.substring(0, 18)
					
					if(this.pedido.usuario_apellido_paterno){
						_usuario_nombre += " "+this.pedido.usuario_apellido_paterno.charAt(0).toUpperCase()+"."
						
					}

				} else {

					_usuario_nombre += this.cse.data.user.data.name.substring(0, 18)
					
					if(this.cse.data.user.data.lastName){
						_usuario_nombre += " "+this.cse.data.user.data.lastName.charAt(0).toUpperCase()+"."
						
					}

				}

				if(this.pedido.usuario_telefono){
					_usuario_telefono = this.pedido.usuario_telefono
				}

				if(this.pedido.tipo_entrega == 1){

					if(this.pedido.usuario_direccion_id){

						let _usuario_direccion = this.usuario_direcciones.find(it => it.usuario_direccion_id == this.pedido.usuario_direccion_id)
	
						if(_usuario_direccion.usuario_telefono){
							_usuario_telefono = _usuario_direccion.usuario_telefono
						}
	
					}

				}

				let _tienda = this.tienda.nombre.substring(0, 20)

				// Llega al vendedor
				this.sms.guardar({
					uid : this.ohService.getOH().getUtil().getUID(),
					mensaje : "Delivery Smart: Nuevo pedido Nro "+resp.resp_new_id+" de  "+_usuario_nombre+" "+(_usuario_telefono ? "Tel "+_usuario_telefono : "")+" "+environment.protocol+"://"+environment.hostLocal+"/#/Be/des/seller/detail/"+resp.resp_new_id,
					numero : this.tienda.telefono,
					pais : this.config.defecto.prefijo_telefono,
					pendiente : true
				})
				
				// Enviando mensaje al comprador
				if(((this.tienda.pedido_local && this.pedido.usuario_id) || !this.tienda.pedido_local) && _usuario_telefono){
					this.sms.guardar({
						uid : this.ohService.getOH().getUtil().getUID(),
						mensaje : "Delivery Smart: Nuevo pedido Nro "+resp.resp_new_id+" en "+_tienda+" Tel "+this.tienda.telefono+" "+environment.protocol+"://"+environment.hostLocal+"/#/Be/des/order/detail/"+resp.resp_new_id,
						numero : _usuario_telefono,
						pais : this.config.defecto.prefijo_telefono,
						pendiente : true
					})
				}

				// Enviando mensaje al comprador nuevo
				if(this.tienda.pedido_local && !this.pedido.usuario_id && _usuario_telefono){
					this.sms.guardar({
						uid : this.ohService.getOH().getUtil().getUID(),
						mensaje : "Delivery Smart: Nuevo pedido Nro "+resp.resp_new_id+" en "+_tienda+" Tel "+this.tienda.telefono+" "+environment.protocol+"://"+environment.hostLocal+"/purchase/"+resp.resp_new_id,
						numero : _usuario_telefono,
						pais : this.config.defecto.prefijo_telefono,
						pendiente : true
					})
				}

				this.limpiarCarrito()
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['/Store', this.tienda.tienda_id], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
				} else {
					if(resp.resp_estado >= 2){
						if(resp.resp_producto_validar){
							this.homologar(JSON.parse(resp.resp_producto_validar))
						} else {
							this.pedidoCancelarConfirmar()
						}
					}
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
	}

	limpiarCarrito(){
		let carritos = this.storage.get("OVN_DES_CART") || {};
		delete carritos[this.tienda.tienda_id];
		delete carritos.defecto;
		this.storage.set("OVN_DES_CART", carritos);
	}
	
	private obtenerDetalle(){
		let pedidos = []
		for(var i in this.carrito){
			pedidos.push({
				tienda_producto_id : this.carrito[i].tienda_producto_id,
				cantidad : this.carrito[i].cantidad,
				precio : this.carrito[i].precio
			})
		}
		return JSON.stringify(pedidos);
	}

	private destiendaObtener(call ?: any){
        this.dESTiendaService.destiendaClienteObtener({
			unidad_negocio_id : this.cse.data.system.business_unit_id,
			usuario_id : this.cse.data.user ? this.cse.data.user.data.userid : null,
            tienda_id : this.tienda.tienda_id
        }, (resp : pDestiendaClienteObtener) => {
			if(resp.tienda){
				if(resp.tienda.estado == this.cse.params.estado.activo){
					this.tienda = resp.tienda
					this.horarios = resp.horarios
					this.medio_pago = resp.pago					
					if(this.cse.tieneRol(['des_admin']) || (resp.usuario_tienda && this.cse.data.user && resp.usuario_tienda.usuario_id == this.cse.data.user.data.userid)){
						this.tienda.pedido_local = true
					} else {
						this.tienda.pedido_local = false
					}
					this.tienda.longitud = Number(resp.tienda.longitud);
					this.tienda.latitud = Number(resp.tienda.latitud);
					if(call){
						call()
					}
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

	pedidoCancelar(){
		this.ohService.getOH().getUtil().confirm("¿Confirma cancelar el pedido?", () => {
			this.pedidoCancelarConfirmar()
		});
	}

	pedidoCancelarConfirmar(){
		let carritos = this.storage.get("OVN_DES_CART") || {};
		delete carritos[this.tienda.tienda_id]
		this.storage.set("OVN_DES_CART", carritos)
		this.router.navigate(['../Store/', this.tienda.tienda_id], { relativeTo: this.route });
		this.ohService.getOH().getAd().warning("Pedido cancelado correctamente");
	}

	productoBorrar(tienda_producto_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma borrar el producto seleccionado?", () => {
			this.carrito.splice(this.carrito.findIndex(it => it.tienda_producto_id == tienda_producto_id), 1)
			if(this.carrito.length == 0){
				this.pedidoCancelarConfirmar()
			} else {
				this.calcularTotal()
			}
		});
	}

	onLoginoutEvent(){
		this.dESPedidoService = new DESPedidoServiceJPO(this.ohService);
		this.aDMUsuarioDireccionService = new ADMUsuarioDireccionServiceJPO(this.ohService);
		this.dESUsuarioService = new DESUsuarioServiceJPO(this.ohService);
		this.destiendaObtener(() => {
			this.gesusuarioDireccionListar()
		})
		if(this.cse.data.user && this.pendienteLoguear){
			this.pendienteLoguear = false
			this.alAbrirModal()
		}
	}

	private alAbrirModal(){
		this.pedirContinuar()
		this.usuarioDireccionLimpiar()
	}

	direcciones_cargadas : boolean
    gesusuarioDireccionListar(){
		this.direcciones_cargadas = false
        this.aDMUsuarioDireccionService.gesusuarioDireccionListar({
            usuario_id : (this.tienda.pedido_local && this.pedido.usuario_id) ? this.pedido.usuario_id : this.cse.data.user.data.userid,
            tipo_direccion_id : this.config.tipo_direccion_des_casa
        }, (resp : pGesusuarioDireccionListar) => {
			this.direcciones_cargadas = true
			this.usuario_direcciones = resp.usuario_direccions
			let _defecto = resp.usuario_direccions.find(it => it.indicador_principal == '1')
			if(_defecto){
				this.pedido.usuario_direccion_id = _defecto.usuario_direccion_id
				if(!this.tienda.pedido_local){
					this.pedido.usuario_telefono = _defecto.telefono
				}
			}
        });
    }

	itemDireccion : any

	direccionEditar(direccion : any){
		this.itemDireccion = JSON.parse(JSON.stringify(direccion))
		if(this.itemDireccion.latitud && this.itemDireccion.longitud){
			this.itemDireccion.indicador_mapa = true
		}
		this.modalService.open(this.modalDireccion).result.then((result) => {
		}, (reason) => {
			
		});
	}

	direccionNueva(){
		let _direccion_ultima
		if(this.usuario_direcciones && this.usuario_direcciones.length > 0){
			_direccion_ultima = this.usuario_direcciones.find(it => it.usuario_direccion_id == this.pedido.usuario_direccion_id)
		}

		this.itemDireccion = {
			latitud : Number(this.config.defecto.gps_latitude),
			longitud : Number(this.config.defecto.gps_longitude),
			telefono : _direccion_ultima ? _direccion_ultima.telefono : "",
			indicador_mapa : false
		}
		this.modalService.open(this.modalDireccion, { size: 'xl' }).result.then((result) => {
		}, (reason) => {
			
		});
	}

	direccionGrabar(c : any){
		if(this.tienda.pedido_local && !this.pedido.usuario_id){
			this.pedido.direccion = this.itemDireccion
			c()
		} else {
			this.ohService.getOH().getUtil().confirm("Confirma grabar dirección", () => {
				if(this.itemDireccion.usuario_direccion_id){
					this.gesusuarioDireccionEditar(c);
				} else {
					this.gesusuarioDireccionRegistrar(c);
				}
			});
		}
	}

	direccionMapaSeleccionar(event: any){
        if(event.place_text){
            this.itemDireccion.direccion = event.place_text
        }
    }

	gesusuarioDireccionRegistrar(c){
        this.aDMUsuarioDireccionService.gesusuarioDireccionRegistrar({
            usuario_id : (this.tienda.pedido_local && this.pedido.usuario_id) ? this.pedido.usuario_id : this.cse.data.user.data.userid,
            tipo_direccion_id : this.config.tipo_direccion_des_casa,
            direccion : this.itemDireccion.direccion,
            longitud : this.itemDireccion.longitud,
            latitud : this.itemDireccion.latitud,
            usuario_registro_id : this.cse.data.user.data.userid,
            indicador_principal : this.itemDireccion.indicador_principal ? '1' : '0',
            telefono : this.itemDireccion.telefono
        }, (resp : pGesusuarioDireccionRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje)
				this.gesusuarioDireccionListar()
				c()
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje)
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje)
				}
			}
        });
    }

	gesusuarioDireccionEditar(c){
        this.aDMUsuarioDireccionService.gesusuarioDireccionEditar({
            usuario_direccion_id : this.itemDireccion.usuario_direccion_id,
            usuario_id : (this.tienda.pedido_local && this.pedido.usuario_id) ? this.pedido.usuario_id : this.cse.data.user.data.userid,
            tipo_direccion_id : this.config.tipo_direccion_des_casa,
            direccion : this.itemDireccion.direccion,
            longitud : this.itemDireccion.longitud,
            latitud : this.itemDireccion.latitud,
            usuario_modificacion_id : this.cse.data.user.data.userid,
            indicador_principal : this.itemDireccion.indicador_principal ? '1' : '0',
            telefono : this.itemDireccion.telefono
        }, (resp : pGesusuarioDireccionEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje)
				this.gesusuarioDireccionListar()
				c()
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje)
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje)
				}
			}
        });
    }

	pedido_encontro : boolean
	pedido_mensaje : boolean
	pedido_usuarios : any = []
    desusuarioDireccionListar(){
		this.pedido_mensaje = false
        this.dESUsuarioService.desusuarioDireccionListar({
            unidad_negocio_id : 1,
            telefono : this.pedido.usuario_telefono
        }, (resp : pDesusuarioDireccionListar[]) => {
			if(resp && resp.length == 1){
				this.usuarioSeleccionar(resp[0])
			} else if(resp && resp.length > 1) {
				this.pedido_usuarios = resp
				this.modalService.open(this.modalSeleccionarUsuario, { backdrop: 'static' }).result.then((result) => {
				}, (reason) => {
				});
			} else {
				this.pedido_mensaje = true
			}
        });
    }

	usuarioDireccionLimpiar(){
		this.pedido.usuario_telefono = null
		this.pedido.usuario_nombres = null
		this.pedido.usuario_apellido_paterno = null
		this.pedido_encontro = false
		this.pedido_mensaje = false
	}

	usuarioSeleccionar(usuario : any, c ?: any){
		this.pedido.usuario_id = usuario.usuario_id
		this.pedido.usuario_nombres = usuario.nombres
		this.pedido.usuario_apellido_paterno = usuario.apellido_paterno
		this.pedido_encontro = true
		this.usuario_direcciones = []
		this.gesusuarioDireccionListar()
		if(c){
			c()
		}

	}

	scrollArriba(){
		let items : any = document.querySelectorAll('[role="dialog"]')
		console.log(items)
		for(var i in items){
			if(typeof items[i] == "object"){
				items[i].scrollTop = 0
			}
		}
	}

}