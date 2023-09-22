
import { DESCoreService } from './des.coreService';
import { environment } from 'src/environments/environment';
import { pDesinicializar, DESPrincipalServiceJPO } from './service/des.dESPrincipalService';
import { CoreService, OHService, ohStorage } from '@ovenfo/framework';

export class DESBase {

    public precarga : Promise<any>;
    public storage : ohStorage;
    private dESPrincipalService : DESPrincipalServiceJPO;

	buscar_whatsapp_texto_de : string = encodeURIComponent("Hola me gustaría comprar algo de tu tienda.")
	buscar_whatsapp_texto_cliente : string = encodeURIComponent("Hola compraste en mi tienda desde Delivery Smart.")
	buscar_whatsapp_soporte : string = encodeURIComponent("Hola necesito ayuda.")
	buscar_whatsapp_soporte_numero : string = ""
	buscar_whatsapp_compartir_url : string

    constructor(ohService : OHService, public cse : CoreService, public dcs : DESCoreService){
        this.storage = new ohStorage();

        this.dESPrincipalService = new DESPrincipalServiceJPO(ohService);
        dcs.config.ruta_firestore = environment.firebase_coleccion_base + "/" + dcs.config.prefix.toUpperCase() + "/";
        this.precarga = new Promise<void>((resolve, reject) => {
            this.loadData(() => {
                resolve();
            });
        });

    }

    loadData(resolve : any){

        if(this.storage.has("OVN_DES_DATA")){
            this.dcs.data = this.storage.get("OVN_DES_DATA");
            this.mapearConfig()
            resolve();
        } else {

            this.dcs.data = {
                catalogo: {}
            };

            var mycatalogo = [
                { id: 41703, nombre: "dia_semana" },
                { id: 20252, nombre: "estado" },
                { id: 41687, nombre: "estado_pedido" },
                { id: 41694, nombre: "estado_categoria_producto" }
            ];

            for (var i in mycatalogo) {
                this.cargarCatalogo(mycatalogo[i], (catalogo) => {
                    if (catalogo.nombre == "estado") {
                        this.parsearEstados("estado");
                    }
                    if (catalogo.nombre == "estado_pedido") {
                        this.parsearEstados("estado_pedido");
                    }
                    if (catalogo.nombre == "estado_categoria_producto") {
                        this.parsearEstados("estado_categoria_producto");
                    }
                });
            }

            this.storage.set("OVN_DES_DATA", this.dcs.data);

            this.dESPrincipalService.desinicializar({
                unidad_negocio_id : this.cse.data.user.profile,
                usuario_id : this.cse.data.user.data.userid
            }, (resp : pDesinicializar) => {
                this.dcs.data.configuraciones = resp.configuraciones
                this.mapearConfig()
                this.dcs.data.un_config = resp.un_config
                this.dcs.data.un_config_format = this.getUNConfigConfig(resp.un_config)
                this.dcs.data.moneda = resp.moneda
                this.dcs.data.moneda_format = this.getMonedaInputConfig(resp.moneda)
                this.dcs.data.direccion = resp.direccion
                this.storage.set("OVN_DES_DATA", this.dcs.data);
                resolve();
            });
            
        }

    }

    private mapearConfig(){
        if(this.dcs.data && this.dcs.data.configuraciones){
            let _whatsapp_contacto = this.dcs.data.configuraciones.find(it => it.etiqueta == 'whatsapp_contacto')
            if(_whatsapp_contacto){
                this.buscar_whatsapp_soporte_numero = _whatsapp_contacto.valor
            }
        }
    }

    private cargarCatalogo(catalogo: any, call?: any) {
        this.cse.adm_catalogo.getCatalogoByPadre(catalogo.id).subscribe((elementos: any) => {
            this.dcs.data.catalogo[catalogo.nombre] = elementos;
            this.storage.set("OVN_DES_DATA", this.dcs.data);
            if (call) {
                call(catalogo);
            }
        });
    }
    
    private parsearEstados(estado_nombre: string) {
        var estado_objetos = {};
        for (var i in this.dcs.data.catalogo[estado_nombre]) {
            let estado = this.dcs.data.catalogo[estado_nombre][i];
            estado_objetos[estado.catalogo_id] = Object.assign({ descripcion: estado.descripcion }, JSON.parse(estado.variable_2));
        }
        this.dcs.data[estado_nombre] = estado_objetos;
        this.storage.set("OVN_DES_DATA", this.dcs.data);
    }

    getMonedaInputConfig(moneda : any){
        return {
            prefix: moneda.simbolo, 
            thousands: moneda.separador_miles, 
            decimal: moneda.separador_decimales, 
            precision: moneda.precision, 
            allowNegative : false, 
            nullable: true
        }
    }

    getUNConfigConfig(un_config : any){
        let un_config_format = {}
        for(var i in un_config){
            if((un_config[i].config_id == 'default_gps_latitude' || un_config[i].config_id == 'default_gps_longitude') && un_config[i].valor){
                un_config_format[un_config[i].config_id] = Number(un_config[i].valor)
            } else {
                un_config_format[un_config[i].config_id] = un_config[i].valor
            }
        }
        return un_config_format
    }

    obtenerTienda(tienda : any){
        return encodeURIComponent(environment.protocol+"://"+environment.hostLocal+"/store/"+tienda)
    }

}