import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";
import { DESPedidoServiceJPO, pDespedidoClienteBuscar } from "./des.dESPedidoService";

export class DESPedidoServiceImpJPO extends DESPedidoServiceJPO {

    override despedidoClienteBuscar(fields : {
        unidad_negocio_id ?: number,
        latitud ?: string,
        longitud ?: string,
        distancia ?: number,
        tienda_nombre ?: string,
        indicador_disponible ?: string,
        categoria_id ?: number
    }, call ?: { (resp: pDespedidoClienteBuscar[]) }){
        return this.jpo.get("despedidoClienteBuscar",{
            fields : fields,
            observer : true,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({tienda_id : rs[i][0], nombre : rs[i][1], categoria_id : rs[i][2], categoria_nombre : rs[i][3], categoria_icono : rs[i][4], telefono : rs[i][5], latitud : rs[i][6], longitud : rs[i][7], distancia : rs[i][8], indicador_disponible : (rs[i][9] == "true" || rs[i][9] == "1")?true:false, empresa_logo_url : rs[i][10]});
                            }
                        }
                    return call(out);
                } else {
                    return null
                }
            }
        });
    }

}