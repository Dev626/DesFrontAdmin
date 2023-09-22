import { Jpo, JpoError } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface destiendaListar_response {total ?: number};
export interface destiendaListar_tiendas {tienda_id ?: number, nombre ?: string, longitud ?: string, latitud ?: string, categoria_id ?: number, categoria_nombre ?: string, icono ?: string, estado ?: number, propietario ?: string};
export class pDestiendaListar {response : destiendaListar_response; tiendas : destiendaListar_tiendas[]};
export class pDestiendaEditarEstado {resp_estado : number; resp_mensaje : string};
export class pDestiendaEditar {resp_estado : number; resp_mensaje : string};
export interface destiendaClienteObtener_tienda {tienda_id ?: number, categoria_id ?: number, categoria_nombre ?: string, categoria_icono ?: string, categoria_indicador_producto ?: boolean, nombre ?: string, telefono ?: string, direccion ?: string, longitud ?: number, latitud ?: number, estado ?: number, productos_activos ?: number, tienda_favorita ?: boolean, indicador_horario ?: boolean, indicador_abierto ?: boolean, empresa_logo_url ?: string, indicador_entrega ?: string, indicador_recojo ?: string, indicador_catalogo ?: string};
export interface destiendaClienteObtener_horarios {tienda_horario_id ?: number, nombre ?: string, seleccionado ?: number, hora_inicio ?: number, hora_fin ?: number};
export interface destiendaClienteObtener_pago {indicador_efectivo ?: boolean, efectivo_maximo ?: number, indicador_tarjeta ?: boolean, indicador_transferencia ?: boolean, indicador_billetera ?: boolean, tarjetas ?: any, bancos ?: any, billeteras ?: any};
export interface destiendaClienteObtener_usuario_tienda {usuario_id ?: number};
export class pDestiendaClienteObtener {tienda : destiendaClienteObtener_tienda; horarios : destiendaClienteObtener_horarios[]; pago : destiendaClienteObtener_pago; usuario_tienda : destiendaClienteObtener_usuario_tienda};
export class pDestiendaAdjuntoEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface destiendaObtener_tienda {tienda_id ?: number, empresa_direccion_id ?: number, categoria_id ?: number, indicador_horario ?: string, categoria_icono ?: string, categoria_indicador_producto ?: boolean, nombre ?: string, telefono ?: string, direccion ?: string, longitud ?: number, latitud ?: number, estado ?: number, fotos ?: any, indicador_entrega ?: string, indicador_recojo ?: string, indicador_catalogo ?: string, descripcion_breve ?: string};
export interface destiendaObtener_horarios {tipo_dia_id ?: number, hora_inicio ?: number, hora_fin ?: number};
export interface destiendaObtener_pago {indicador_efectivo ?: boolean, efectivo_maximo ?: number, indicador_tarjeta ?: boolean, indicador_transferencia ?: boolean, indicador_billetera ?: boolean, tarjetas ?: any, bancos ?: any, billeteras ?: any};
export interface destiendaObtener_store_social_network {store_social_network_id ?: number, cat_type_social_network_id ?: number, url ?: string, active ?: boolean, position ?: number};
export class pDestiendaObtener {tienda : destiendaObtener_tienda; horarios : destiendaObtener_horarios[]; pago : destiendaObtener_pago; store_social_network : destiendaObtener_store_social_network[]};
export class pDestiendaRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class DESTiendaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESTiendaServiceImp");
    }

    destiendaListar(fields : {
        usuario_id ?: number,
        tienda_id ?: number,
        tienda_nombre ?: string,
        propietario ?: string,
        page ?: number,
        size ?: number
    }, call ? : { (resp: pDestiendaListar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaListar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.tiendas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.tiendas.push({tienda_id : rs[1][i][0], nombre : rs[1][i][1], longitud : rs[1][i][2], latitud : rs[1][i][3], categoria_id : rs[1][i][4], categoria_nombre : rs[1][i][5], icono : rs[1][i][6], estado : rs[1][i][7], propietario : rs[1][i][8]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaEditarEstado(fields : {
        tienda_id ?: number,
        estado ?: number,
        usuario_modificacion_id ?: number
    }, call ? : { (resp: pDestiendaEditarEstado) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaEditarEstado",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaEditarEstado();
                        if(rs){
                            out.resp_estado = rs[0];
                            out.resp_mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaEditar(fields : {
        key_user_id ?: number,
        tienda_id ?: number,
        empresa_direccion_id ?: number,
        nombre ?: string,
        telefono ?: string,
        direccion ?: string,
        longitud ?: string,
        latitud ?: string,
        categoria_id ?: number,
        usuario_modificacion_id ?: number,
        fotos ?: string,
        indicador_horario ?: string,
        indicador_entrega ?: string,
        indicador_recojo ?: string,
        indicador_catalogo ?: string,
        horarios ?: string,
        medios_pago ?: string
    }, call ? : { (resp: pDestiendaEditar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaEditar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaEditar();
                        if(rs){
                            out.resp_estado = rs[0];
                            out.resp_mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaClienteObtener(fields : {
        key_user_id ?: number,
        unidad_negocio_id ?: number,
        usuario_id ?: number,
        tienda_id ?: number
    }, call ? : { (resp: pDestiendaClienteObtener) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaClienteObtener",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaClienteObtener();
                        if(rs[0] && rs[0][0]){
                            out.tienda = {tienda_id : rs[0][0][0], categoria_id : rs[0][0][1], categoria_nombre : rs[0][0][2], categoria_icono : rs[0][0][3], categoria_indicador_producto : (rs[0][0][4] == "true" || rs[0][0][4] == "1")?true:false, nombre : rs[0][0][5], telefono : rs[0][0][6], direccion : rs[0][0][7], longitud : rs[0][0][8], latitud : rs[0][0][9], estado : rs[0][0][10], productos_activos : rs[0][0][11], tienda_favorita : (rs[0][0][12] == "true" || rs[0][0][12] == "1")?true:false, indicador_horario : (rs[0][0][13] == "true" || rs[0][0][13] == "1")?true:false, indicador_abierto : (rs[0][0][14] == "true" || rs[0][0][14] == "1")?true:false, empresa_logo_url : rs[0][0][15], indicador_entrega : rs[0][0][16], indicador_recojo : rs[0][0][17], indicador_catalogo : rs[0][0][18]};
                        }
                        if(rs[1]){
                            out.horarios = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.horarios.push({tienda_horario_id : rs[1][i][0], nombre : rs[1][i][1], seleccionado : rs[1][i][2], hora_inicio : rs[1][i][3], hora_fin : rs[1][i][4]});
                            }
                        }
                        if(rs[2] && rs[2][0]){
                            out.pago = {indicador_efectivo : (rs[2][0][0] == "true" || rs[2][0][0] == "1")?true:false, efectivo_maximo : rs[2][0][1], indicador_tarjeta : (rs[2][0][2] == "true" || rs[2][0][2] == "1")?true:false, indicador_transferencia : (rs[2][0][3] == "true" || rs[2][0][3] == "1")?true:false, indicador_billetera : (rs[2][0][4] == "true" || rs[2][0][4] == "1")?true:false, tarjetas : (rs[2][0][5])?JSON.parse(rs[2][0][5]):null, bancos : (rs[2][0][6])?JSON.parse(rs[2][0][6]):null, billeteras : (rs[2][0][7])?JSON.parse(rs[2][0][7]):null};
                        }
                        if(rs[3] && rs[3][0]){
                            out.usuario_tienda = {usuario_id : rs[3][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaAdjuntoEliminar(fields : {
        tienda_id ?: number,
        usuario_id ?: number,
        adjunto_id ?: number
    }, call ? : { (resp: pDestiendaAdjuntoEliminar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaAdjuntoEliminar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaAdjuntoEliminar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

    destiendaObtener(fields : {
        key_user_id ?: number,
        usuario_id ?: number,
        tienda_id ?: number
    }, call ? : { (resp: pDestiendaObtener) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaObtener",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaObtener();
                        if(rs[0] && rs[0][0]){
                            out.tienda = {tienda_id : rs[0][0][0], empresa_direccion_id : rs[0][0][1], categoria_id : rs[0][0][2], indicador_horario : rs[0][0][3], categoria_icono : rs[0][0][4], categoria_indicador_producto : (rs[0][0][5] == "true" || rs[0][0][5] == "1")?true:false, nombre : rs[0][0][6], telefono : rs[0][0][7], direccion : rs[0][0][8], longitud : rs[0][0][9], latitud : rs[0][0][10], estado : rs[0][0][11], fotos : (rs[0][0][12])?JSON.parse(rs[0][0][12]):null, indicador_entrega : rs[0][0][13], indicador_recojo : rs[0][0][14], indicador_catalogo : rs[0][0][15], descripcion_breve : rs[0][0][16]};
                        }
                        if(rs[1]){
                            out.horarios = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.horarios.push({tipo_dia_id : rs[1][i][0], hora_inicio : rs[1][i][1], hora_fin : rs[1][i][2]});
                            }
                        }
                        if(rs[2] && rs[2][0]){
                            out.pago = {indicador_efectivo : (rs[2][0][0] == "true" || rs[2][0][0] == "1")?true:false, efectivo_maximo : rs[2][0][1], indicador_tarjeta : (rs[2][0][2] == "true" || rs[2][0][2] == "1")?true:false, indicador_transferencia : (rs[2][0][3] == "true" || rs[2][0][3] == "1")?true:false, indicador_billetera : (rs[2][0][4] == "true" || rs[2][0][4] == "1")?true:false, tarjetas : (rs[2][0][5])?JSON.parse(rs[2][0][5]):null, bancos : (rs[2][0][6])?JSON.parse(rs[2][0][6]):null, billeteras : (rs[2][0][7])?JSON.parse(rs[2][0][7]):null};
                        }
                        if(rs[3]){
                            out.store_social_network = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.store_social_network.push({store_social_network_id : rs[3][i][0], cat_type_social_network_id : rs[3][i][1], url : rs[3][i][2], active : (rs[3][i][3] == "true" || rs[3][i][3] == "1")?true:false, position : rs[3][i][4]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaRegistrar(fields : {
        key_user_id ?: number,
        unidad_negocio_id ?: number,
        nombre ?: string,
        categoria_id ?: number,
        telefono ?: string,
        direccion ?: string,
        longitud ?: string,
        latitud ?: string,
        usuario_registro_id ?: number,
        fotos ?: string,
        indicador_horario ?: string,
        indicador_entrega ?: string,
        indicador_recojo ?: string,
        indicador_catalogo ?: string,
        horarios ?: string,
        medios_pago ?: string,
        empresa_id ?: number
    }, call ? : { (resp: pDestiendaRegistrar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaRegistrar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}
