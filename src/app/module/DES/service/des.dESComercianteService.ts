import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface destiendaComerciantePedidoListar_response {total_registros ?: number, fecha_actual ?: Date};
export interface destiendaComerciantePedidoListar_pedidos {pedido_id ?: number, categoria_icono ?: string, cliente ?: string, tienda_nombre ?: string, fecha_registro ?: Date, total ?: number, estado ?: number, tipo_atencion ?: string};
export class pDestiendaComerciantePedidoListar {response : destiendaComerciantePedidoListar_response; pedidos : destiendaComerciantePedidoListar_pedidos[]};
export class pDestiendaComercianteObtener {total : number; razon_comercial : string};

export class DESComercianteServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESComercianteServiceImp");
    }

    destiendaComerciantePedidoListar(fields : {
        usuario_id ?: number,
        estado ?: number,
        pedido_id ?: number,
        tienda_nombre ?: string,
        cliente ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDestiendaComerciantePedidoListar) }){
        this.jpo.get("destiendaComerciantePedidoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaComerciantePedidoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total_registros : rs[0][0][0], fecha_actual : (rs[0][0][1])?new Date(rs[0][0][1]):null};
                        }
                        if(rs[1]){
                            out.pedidos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.pedidos.push({pedido_id : rs[1][i][0], categoria_icono : rs[1][i][1], cliente : rs[1][i][2], tienda_nombre : rs[1][i][3], fecha_registro : (rs[1][i][4])?new Date(rs[1][i][4]):null, total : rs[1][i][5], estado : rs[1][i][6], tipo_atencion : rs[1][i][7]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaComercianteObtener(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pDestiendaComercianteObtener) }){
        this.jpo.get("destiendaComercianteObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {total : rs[0][0], razon_comercial : rs[0][1]};
                        }
                    call(out);
                }
            }
        });
    }

}