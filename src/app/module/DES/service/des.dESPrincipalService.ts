import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface desinicializar_configuraciones {etiqueta ?: string, valor ?: string};
export interface desinicializar_moneda {moneda_id ?: number, nombre ?: string, abreviatura ?: string, simbolo ?: string, separador_miles ?: string, separador_decimales ?: string, precision ?: string, ICU ?: string};
export interface desinicializar_un_config {config_id ?: string, valor ?: string};
export interface desinicializar_direccion {total ?: number};
export class pDesinicializar {configuraciones : desinicializar_configuraciones[]; moneda : desinicializar_moneda; un_config : desinicializar_un_config[]; direccion : desinicializar_direccion};

export class DESPrincipalServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESPrincipalServiceImp");
    }

    desinicializar(fields : {
        unidad_negocio_id ?: number,
        usuario_id ?: number
    }, call ?: { (resp: pDesinicializar) }){
        this.jpo.get("desinicializar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesinicializar();
                        if(rs[0]){
                            out.configuraciones = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.configuraciones.push({etiqueta : rs[0][i][0], valor : rs[0][i][1]});
                            }
                        }
                        if(rs[1] && rs[1][0]){
                            out.moneda = {moneda_id : rs[1][0][0], nombre : rs[1][0][1], abreviatura : rs[1][0][2], simbolo : rs[1][0][3], separador_miles : rs[1][0][4], separador_decimales : rs[1][0][5], precision : rs[1][0][6], ICU : rs[1][0][7]};
                        }
                        if(rs[2]){
                            out.un_config = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.un_config.push({config_id : rs[2][i][0], valor : rs[2][i][1]});
                            }
                        }
                        if(rs[3] && rs[3][0]){
                            out.direccion = {total : rs[3][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}