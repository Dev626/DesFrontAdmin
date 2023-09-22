import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDesatributoEditar {resp_estado : number; resp_mensaje : string};
export interface desatributoListar_response {total ?: number};
export interface desatributoListar_atributos {atributo_id ?: number, nombre ?: string, estado ?: number, fecha_registro ?: Date, fecha_modificacion ?: Date};
export class pDesatributoListar {response : desatributoListar_response; atributos : desatributoListar_atributos[]};
export class pDesatributoObtener {atributo_id : number; nombre : string; estado : number; fecha_registro : Date; fecha_modificacion : Date};
export class pDesatributoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class DESAtributoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESAtributoServiceImp");
    }

    desatributoEditar(fields : {
        atributo_id ?: number,
        nombre ?: string,
        estado ?: number,
        usuario_modificacion_id ?: number
    }, call ?: { (resp: pDesatributoEditar) }){
        this.jpo.get("desatributoEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesatributoEditar();
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

    desatributoListar(fields : {
        atributo_id ?: number,
        nombre ?: string,
        estado ?: number,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDesatributoListar) }){
        this.jpo.get("desatributoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesatributoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.atributos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.atributos.push({atributo_id : rs[1][i][0], nombre : rs[1][i][1], estado : rs[1][i][2], fecha_registro : (rs[1][i][3])?new Date(rs[1][i][3]):null, fecha_modificacion : (rs[1][i][4])?new Date(rs[1][i][4]):null});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    desatributoObtener(fields : {
        atributo_id ?: number
    }, call ?: { (resp: pDesatributoObtener) }){
        this.jpo.get("desatributoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {atributo_id : rs[0][0], nombre : rs[0][1], estado : rs[0][2], fecha_registro : (rs[0][3])?new Date(rs[0][3]):null, fecha_modificacion : (rs[0][4])?new Date(rs[0][4]):null};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    desatributoRegistrar(fields : {
        nombre ?: string,
        estado ?: number,
        usuario_registro_id ?: number
    }, call ?: { (resp: pDesatributoRegistrar) }){
        this.jpo.get("desatributoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesatributoRegistrar();
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