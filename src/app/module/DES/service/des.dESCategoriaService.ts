import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDescategoriaRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDescategoriaObtener {categoria_id : number; nombre : string; estado : number; indicador_producto : boolean; fecha_registro : Date; fecha_modificacion : Date; icono : string};
export interface descategoriaListar_response {total ?: number};
export interface descategoriaListar_categorias {categoria_id ?: number, nombre ?: string, estado ?: number, indicador_producto ?: boolean, fecha_registro ?: Date, fecha_modificacion ?: Date, icono ?: string};
export class pDescategoriaListar {response : descategoriaListar_response; categorias : descategoriaListar_categorias[]};
export class pDescategoriaEditar {resp_estado : number; resp_mensaje : string};
export class pDescategoriaListarDisponibles {categoria_id : number; nombre : string};

export class DESCategoriaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESCategoriaServiceImp");
    }

    descategoriaRegistrar(fields : {
        nombre ?: string,
        icono ?: string,
        estado ?: number,
        indicador_producto ?: string,
        usuario_registro_id ?: number
    }, call ?: { (resp: pDescategoriaRegistrar) }){
        this.jpo.get("descategoriaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaRegistrar();
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

    descategoriaObtener(fields : {
        categoria_id ?: number
    }, call ?: { (resp: pDescategoriaObtener) }){
        this.jpo.get("descategoriaObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {categoria_id : rs[0][0], nombre : rs[0][1], estado : rs[0][2], indicador_producto : (rs[0][3] == "true" || rs[0][3] == "1")?true:false, fecha_registro : (rs[0][4])?new Date(rs[0][4]):null, fecha_modificacion : (rs[0][5])?new Date(rs[0][5]):null, icono : rs[0][6]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    descategoriaListar(fields : {
        categoria_id ?: number,
        nombre ?: string,
        estado ?: number,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDescategoriaListar) }){
        this.jpo.get("descategoriaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.categorias = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.categorias.push({categoria_id : rs[1][i][0], nombre : rs[1][i][1], estado : rs[1][i][2], indicador_producto : (rs[1][i][3] == "true" || rs[1][i][3] == "1")?true:false, fecha_registro : (rs[1][i][4])?new Date(rs[1][i][4]):null, fecha_modificacion : (rs[1][i][5])?new Date(rs[1][i][5]):null, icono : rs[1][i][6]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    descategoriaEditar(fields : {
        categoria_id ?: number,
        nombre ?: string,
        estado ?: number,
        indicador_producto ?: string,
        usuario_modificacion_id ?: number,
        icono ?: string
    }, call ?: { (resp: pDescategoriaEditar) }){
        this.jpo.get("descategoriaEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDescategoriaEditar();
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

    descategoriaListarDisponibles(call ?: { (resp: pDescategoriaListarDisponibles[]) }){
        this.jpo.get("descategoriaListarDisponibles",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({categoria_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}