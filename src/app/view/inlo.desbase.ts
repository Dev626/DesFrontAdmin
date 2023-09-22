
import { CoreService, OHService, OVCBase } from '@ovenfo/framework';
import { environment } from 'src/environments/environment';

/*
	defecto		[{"etiqueta":"whatsapp_contacto","valor":"990624953"},{"etiqueta":"gps_latitude","valor":"-12.0463731"},{"etiqueta":"gps_longitude","valor":"-77.042754"}]
	defecto		[{"moneda_id":5,"nombre":"Nuevo Sol","abreviatura":"PEN","simbolo":"S\/.","separador_miles":",","separador_decimales":".","precision":"2","ICU":"es-US"}]
	defecto		[{"categoria_id":1,"nombre":"ABARROTES"},{"categoria_id":3,"nombre":"LIBRERIA"},{"categoria_id":2,"nombre":"LICORERIA"}]
*/
export class INLODESBase extends OVCBase {
	
	config : any = {
		url_landing : "https://about.delivery-smart.com/",
		url_noImage : "https://firebasestorage.googleapis.com/v0/b/stone-net-265023.appspot.com/o/OVN_PROD%2FDES%2Fno_product_image.png?alt=media&token=6e831865-becf-4452-b6c1-20c5f5b4ff35",
		whatsapp_consultar : encodeURIComponent("Hola me gustaría comprar algo de tu tienda."),
		buscar_whatsapp_soporte : encodeURIComponent("Hola necesito ayuda."),
		marcador : {
			defecto : "https://firebasestorage.googleapis.com/v0/b/apm-inland.appspot.com/o/marker_selected_tiny.png?alt=media&token=fb36f55d-e837-40ec-b279-50dd1e1bfd9d"
		},
		tipo_direccion_des_casa : 41712,
		paises : [
			{
				unidad_negocio_id : 1,
				nombre : "Perú",
				img : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/50px-Flag_of_Peru.svg.png"
			},
			{
				unidad_negocio_id : 20,
				nombre : "Argentina",
				img : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/75px-Flag_of_Argentina.svg.png"
			}
		]
	}

	doLogoutEvent : any = {}
	
	tienda : any = {};
	carrito : any = [];

	constructor(public override ohService: OHService, public override cse: CoreService) {

		super(ohService, cse)

		this.doLogoutEvent.getUserData = () => {
			this.getUserData()
		}
		this.doLogoutEvent.getUserData()

		this.precarga.then(() => {
			
			if(this.cse.data.system.configuracion && this.cse.data.system.configuracion.data){

				let _defecto = JSON.parse(this.cse.data.system.configuracion.data[0].registros)
				this.config.defecto = {}
				for(var item of _defecto){
					this.config.defecto[item.etiqueta] = item.valor
				}

				this.config.moneda = JSON.parse(this.cse.data.system.configuracion.data[1].registros)
				this.config.moneda_defecto = {}
				if(this.config.moneda.length > 0){
					this.config.moneda_defecto = this.config.moneda[0]
					this.config.moneda_defecto_format = this.getMonedaInputConfig(this.config.moneda[0])
				}

				this.config.categorias = JSON.parse(this.cse.data.system.configuracion.data[2].registros)

				this.config.videoOcultar = this.cse.data.system.configuracion.videoOcultar ? true : false

				if(this.config.paises){
					//let _pais = this.config.paises.find(it => it.unidad_negocio_id == this.cse.data.system.business_unit_id)
					let _pais = this.config.paises.find(it => it.unidad_negocio_id == this.config.paises[0].unidad_negocio_id)
					this.config.pais = _pais
				}

			}

		})
		
	}

	private getUserData(){
		if (this.storage.has("OVN_DATA")) {
		
			let _user = this.storage.get("OVN_DATA")
			this.cse.data.user = _user;

			this.ohService.getOH().setShareConfig({
				token: _user.data.token,
				onUnAuthrorized: () => {
					if(this.doLogoutEvent.done){
						this.doLogoutEvent.done()
					}
				},
				onForbidden: () => {
					this.ohService.getOH().getAd().warning("No tienes permisos, contactar con el administrador");
				}
			})
				
			this.ohService.getOH().getLoader().close();

		}
	}

	private getMonedaInputConfig(moneda : any){
        return {
            prefix: moneda.simbolo, 
            thousands: moneda.separador_miles, 
            decimal: moneda.separador_decimales, 
            precision: moneda.precision, 
            allowNegative : false, 
            nullable: true
        }
    }
	
	obtenerTienda(tienda_id : any){
        return encodeURIComponent(environment.protocol+"://"+environment.hostLocal+"/store/"+tienda_id)
    }

	obtenerProducto(tienda_id : any, producto_id : any){
        return encodeURIComponent(environment.protocol+"://"+environment.hostLocal+"/store/"+tienda_id+"/product/"+producto_id)
    }

	mapHeader(nombre : string, descripcion : string, img_url : string){

		var meta1 = document.getElementById("desm1") || document.createElement('meta');
			meta1.id = "desm1"
			meta1['httpEquiv'] = "Cache-control";
			meta1['content'] = "public, max-age=120, s-maxage=240";

		var meta2 = document.getElementById("desm2") || document.createElement('meta');
			meta2.id = "desm2"
			meta2['name'] = "description";
			meta2['content'] = descripcion;
			
		var meta3 = document.getElementById("desm3") || document.createElement('meta');
			meta3.id = "desm3"
			meta3.setAttribute('property', 'og:title');
			meta3['content'] = nombre;
			
		var meta4 = document.getElementById("desm4") || document.createElement('meta');
			meta4.id = "desm4"
			meta4.setAttribute('property', 'og:description');
			meta4['content'] = descripcion;
			
		var meta5 = document.getElementById("desm5") || document.createElement('meta');
			meta5.id = "desm5"
			meta5.setAttribute('property', 'og:image');
			meta5['content'] = img_url;
			
		let _head = document.getElementsByTagName('head')[0]

		_head.appendChild(meta1)
		_head.appendChild(meta2)
		_head.appendChild(meta3)
		_head.appendChild(meta4)
		_head.appendChild(meta5)

	}

	countryChange(business_unit_id, call ?: any){
		this.storage.add("OVN_SYSTEM", "business_unit_id", business_unit_id)
		this.cse.data.system.business_unit_id = business_unit_id
		this.segsistemaInicializar(call)
	}

	carritoValidar(){
		let carritos = this.storage.get("OVN_DES_CART") || {};
		let carro_tienda = carritos[this.tienda.tienda_id];
		if(!carro_tienda){
			carro_tienda = {
				tienda : this.tienda,
				productos : []
			}
		}
		this.carrito = carro_tienda.productos;
	}

	carritoAgregar(producto : any){
		let indice = this.carrito.findIndex(it => it.tienda_producto_id == producto.tienda_producto_id);
		if(indice >= 0){
			this.carrito.splice(indice, 1);
			this.ohService.getOH().getAd().success("Quitado del carrito");
		} else {
			this.carrito.push(producto);
			this.ohService.getOH().getAd().success("Agregado al carrito");
		}
		producto.agregado = !producto.agregado;

		let carritos = this.storage.get("OVN_DES_CART") || {};
		let carro_tienda = carritos[this.tienda.tienda_id];
		if(!carro_tienda){
			this.tienda.unidad_negocio_id = this.cse.data.system.business_unit_id
			carro_tienda = {
				tienda : this.tienda
			}
		}
		carro_tienda.productos = this.carrito
		carritos[this.tienda.tienda_id] = carro_tienda
		carritos.defecto = this.tienda.tienda_id
		this.storage.set("OVN_DES_CART", carritos)
	}

	marcarTienda(){
		this.storage.add("OVN_DES_CART", "defecto", this.tienda.tienda_id);
	}

}