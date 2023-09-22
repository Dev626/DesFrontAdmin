import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface desbancoListar_response {total ?: number};
export interface desbancoListar_bancos {banco_id ?: number, unidad_negocio_id ?: number, nombre ?: string, adjunto_id ?: number};
export class pDesbancoListar {response : desbancoListar_response; bancos : desbancoListar_bancos[]};

export class DESBancoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESBancoServiceImp");
    }

    desbancoListar(fields : {
        banco_id ?: number,
        unidad_negocio_id ?: number,
        nombre ?: string,
        adjunto_id ?: number,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDesbancoListar) }){
        this.jpo.get("desbancoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesbancoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.bancos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.bancos.push({banco_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], nombre : rs[1][i][2], adjunto_id : rs[1][i][3]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}