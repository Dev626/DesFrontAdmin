import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface destarjetaListar_response {total ?: number};
export interface destarjetaListar_tarjetas {tarjeta_id ?: number, unidad_negocio_id ?: number, nombre ?: string, adjunto_id ?: number};
export class pDestarjetaListar {response : destarjetaListar_response; tarjetas : destarjetaListar_tarjetas[]};

export class DESTarjetaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESTarjetaServiceImp");
    }

    destarjetaListar(fields : {
        tarjeta_id ?: number,
        unidad_negocio_id ?: number,
        nombre ?: string,
        adjunto_id ?: number,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDestarjetaListar) }){
        this.jpo.get("destarjetaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDestarjetaListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.tarjetas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.tarjetas.push({tarjeta_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], nombre : rs[1][i][2], adjunto_id : rs[1][i][3]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}