import { OHService } from "@ovenfo/framework";
import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";

export class pGesusuarioDireccionRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface gesusuarioDireccionListar_response {total ?: number};
export interface gesusuarioDireccionListar_usuario_direccions {usuario_direccion_id ?: number, usuario_id ?: number, tipo_direccion_id ?: number, direccion ?: string, longitud ?: string, latitud ?: string, indicador_principal ?: string, telefono ?: string};
export class pGesusuarioDireccionListar {response : gesusuarioDireccionListar_response; usuario_direccions : gesusuarioDireccionListar_usuario_direccions[]};
export class pGesusuarioDireccionEditar {resp_estado : number; resp_mensaje : string};

export class ADMUsuarioDireccionServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnADM","ADM","module.adm","ADMUsuarioDireccionServiceImp");
    }

    gesusuarioDireccionRegistrar(fields : {
        usuario_id ?: number,
        tipo_direccion_id ?: number,
        direccion ?: string,
        longitud ?: number,
        latitud ?: number,
        usuario_registro_id ?: number,
        indicador_principal ?: string,
        telefono ?: string
    }, call ?: { (resp: pGesusuarioDireccionRegistrar) }){
        this.jpo.get("gesusuarioDireccionRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesusuarioDireccionRegistrar();
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

    gesusuarioDireccionListar(fields : {
        usuario_id ?: number,
        tipo_direccion_id ?: number,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesusuarioDireccionListar) }){
        this.jpo.get("gesusuarioDireccionListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesusuarioDireccionListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.usuario_direccions = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.usuario_direccions.push({usuario_direccion_id : rs[1][i][0], usuario_id : rs[1][i][1], tipo_direccion_id : rs[1][i][2], direccion : rs[1][i][3], longitud : rs[1][i][4], latitud : rs[1][i][5], indicador_principal : rs[1][i][6], telefono : rs[1][i][7]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    gesusuarioDireccionEditar(fields : {
        usuario_direccion_id ?: number,
        usuario_id ?: number,
        tipo_direccion_id ?: number,
        direccion ?: string,
        longitud ?: number,
        latitud ?: number,
        usuario_modificacion_id ?: number,
        indicador_principal ?: string,
        telefono ?: string
    }, call ?: { (resp: pGesusuarioDireccionEditar) }){
        this.jpo.get("gesusuarioDireccionEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesusuarioDireccionEditar();
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