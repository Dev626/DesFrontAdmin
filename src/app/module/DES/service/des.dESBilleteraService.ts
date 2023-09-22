import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface desbilleteraListar_response {total ?: number};
export interface desbilleteraListar_billeteras {billetera_id ?: number, unidad_negocio_id ?: number, nombre ?: string};
export class pDesbilleteraListar {response : desbilleteraListar_response; billeteras : desbilleteraListar_billeteras[]};

export class DESBilleteraServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESBilleteraServiceImp");
    }

    desbilleteraListar(fields : {
        billetera_id ?: number,
        unidad_negocio_id ?: number,
        nombre ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDesbilleteraListar) }){
        this.jpo.get("desbilleteraListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesbilleteraListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.billeteras = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.billeteras.push({billetera_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], nombre : rs[1][i][2]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}