import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDescategoriaProductoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDescategoriaProductoObtener {categoria_producto_id : number; categoria_id : number; nombre : string; fotos : any; atributos : any; estado : number; fecha_registro : Date; fecha_modificacion : Date};
export interface descategoriaProductoListar_response {total ?: number};
export interface descategoriaProductoListar_categoria_productos {categoria_producto_id ?: number, categoria_id ?: number, nombre ?: string, estado ?: number, fecha_registro ?: Date, fecha_modificacion ?: Date};
export class pDescategoriaProductoListar {response : descategoriaProductoListar_response; categoria_productos : descategoriaProductoListar_categoria_productos[]};
export class pDescategoriaProductoEditar {resp_estado : number; resp_mensaje : string};
export interface descategoriaProductoComboListar_productos {categoria_producto_id ?: number, nombre ?: string};
export interface descategoriaProductoComboListar_fotos {categoria_producto_id ?: number, url ?: string};
export class pDescategoriaProductoComboListar {productos : descategoriaProductoComboListar_productos[]; fotos : descategoriaProductoComboListar_fotos[]};
export class pDescategoriaProductoAdjuntoEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDescategoriaProductoEliminar {resp_estado : number; resp_mensaje : string};

export class DESCategoriaProductoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESCategoriaProductoServiceImp");
    }

    descategoriaProductoRegistrar(fields : {
        categoria_id ?: number,
        adjuntos ?: string,
        nombre ?: string,
        estado ?: number,
        usuario_registro_id ?: number,
        categoria_producto_atributo ?: string
    }, call ?: { (resp: pDescategoriaProductoRegistrar) }){
        this.jpo.get("descategoriaProductoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoRegistrar();
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

    descategoriaProductoObtener(fields : {
        categoria_producto_id ?: number
    }, call ?: { (resp: pDescategoriaProductoObtener) }){
        this.jpo.get("descategoriaProductoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {categoria_producto_id : rs[0][0], categoria_id : rs[0][1], nombre : rs[0][2], fotos : JSON.parse(rs[0][3]), atributos : JSON.parse(rs[0][4]), estado : rs[0][5], fecha_registro : (rs[0][6])?new Date(rs[0][6]):null, fecha_modificacion : (rs[0][7])?new Date(rs[0][7]):null};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    descategoriaProductoListar(fields : {
        categoria_producto_id ?: number,
        categoria_id ?: number,
        nombre ?: string,
        estado ?: number,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDescategoriaProductoListar) }){
        this.jpo.get("descategoriaProductoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.categoria_productos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.categoria_productos.push({categoria_producto_id : rs[1][i][0], categoria_id : rs[1][i][1], nombre : rs[1][i][2], estado : rs[1][i][3], fecha_registro : (rs[1][i][4])?new Date(rs[1][i][4]):null, fecha_modificacion : (rs[1][i][5])?new Date(rs[1][i][5]):null});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    descategoriaProductoEditar(fields : {
        categoria_producto_id ?: number,
        adjuntos ?: string,
        nombre ?: string,
        estado ?: number,
        usuario_modificacion_id ?: number,
        categoria_producto_atributo ?: string
    }, call ?: { (resp: pDescategoriaProductoEditar) }){
        this.jpo.get("descategoriaProductoEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoEditar();
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

    descategoriaProductoComboListar(fields : {
        categoria_id ?: number
    }, call ?: { (resp: pDescategoriaProductoComboListar) }){
        this.jpo.get("descategoriaProductoComboListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoComboListar();
                        if(rs[0]){
                            out.productos = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.productos.push({categoria_producto_id : rs[0][i][0], nombre : rs[0][i][1]});
                            }
                        }
                        if(rs[1]){
                            out.fotos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.fotos.push({categoria_producto_id : rs[1][i][0], url : rs[1][i][1]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    descategoriaProductoAdjuntoEliminar(fields : {
        categoria_producto_id ?: number,
        usuario_id ?: number,
        adjunto_id ?: number
    }, call ?: { (resp: pDescategoriaProductoAdjuntoEliminar) }){
        this.jpo.get("descategoriaProductoAdjuntoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoAdjuntoEliminar();
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

    descategoriaProductoEliminar(fields : {
        categoria_producto_id ?: number
    }, call ?: { (resp: pDescategoriaProductoEliminar) }){
        this.jpo.get("descategoriaProductoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaProductoEliminar();
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

}