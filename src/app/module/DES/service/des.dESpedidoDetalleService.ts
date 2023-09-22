import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface despedidoDetalleObtener_tienda {tienda_id ?: number, categoria_id ?: number, categoria_icono ?: string, categoria_indicador_producto ?: boolean, nombre ?: string, telefono ?: string, direccion ?: string, longitud ?: number, latitud ?: number, estado ?: number};
export interface despedidoDetalleObtener_pedido {pedido_id ?: number, tipo_entrega ?: string, tipo_entrega_detalle ?: string, medio_pago ?: number, medio_pago_detalle ?: string, usuario_id ?: number, cliente ?: string, direccion ?: string, longitud ?: string, latitud ?: string, telefono ?: string, tipo_atencion ?: string};
export interface despedidoDetalleObtener_pedido_historial {pedido_historial_id ?: number, comentario ?: string, estado ?: number, usuario_id ?: number, nombres ?: string, apellidos ?: string, fecha_registro ?: Date};
export interface despedidoDetalleObtener_productos {pedido_detalle_id ?: number, pedido_id ?: number, categoria_producto_id ?: number, nombre ?: string, cantidad ?: number, simbolo ?: string, precio ?: string, monto_total ?: string, url ?: string, tienda_producto_id ?: string};
export class pDespedidoDetalleObtener {tienda : despedidoDetalleObtener_tienda; pedido : despedidoDetalleObtener_pedido; pedido_historial : despedidoDetalleObtener_pedido_historial[]; productos : despedidoDetalleObtener_productos[]};
export class pDestiendaFavoritaListar {tienda_id : number; categoria_id : number; categoria_icono : string; nombre : string; telefono : string; direccion : string; longitud : number; latitud : number; estado : number};

export class DESpedidoDetalleServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESpedidoDetalleServiceImp");
    }

    despedidoDetalleObtener(fields : {
        pedido_id ?: number
    }, call ?: { (resp: pDespedidoDetalleObtener) }){
        this.jpo.get("despedidoDetalleObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDespedidoDetalleObtener();
                        if(rs[0] && rs[0][0]){
                            out.tienda = {tienda_id : rs[0][0][0], categoria_id : rs[0][0][1], categoria_icono : rs[0][0][2], categoria_indicador_producto : (rs[0][0][3] == "true" || rs[0][0][3] == "1")?true:false, nombre : rs[0][0][4], telefono : rs[0][0][5], direccion : rs[0][0][6], longitud : rs[0][0][7], latitud : rs[0][0][8], estado : rs[0][0][9]};
                        }
                        if(rs[1] && rs[1][0]){
                            out.pedido = {pedido_id : rs[1][0][0], tipo_entrega : rs[1][0][1], tipo_entrega_detalle : rs[1][0][2], medio_pago : rs[1][0][3], medio_pago_detalle : rs[1][0][4], usuario_id : rs[1][0][5], cliente : rs[1][0][6], direccion : rs[1][0][7], longitud : rs[1][0][8], latitud : rs[1][0][9], telefono : rs[1][0][10], tipo_atencion : rs[1][0][11]};
                        }
                        if(rs[2]){
                            out.pedido_historial = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.pedido_historial.push({pedido_historial_id : rs[2][i][0], comentario : rs[2][i][1], estado : rs[2][i][2], usuario_id : rs[2][i][3], nombres : rs[2][i][4], apellidos : rs[2][i][5], fecha_registro : (rs[2][i][6])?new Date(rs[2][i][6]):null});
                            }
                        }
                        if(rs[3]){
                            out.productos = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.productos.push({pedido_detalle_id : rs[3][i][0], pedido_id : rs[3][i][1], categoria_producto_id : rs[3][i][2], nombre : rs[3][i][3], cantidad : rs[3][i][4], simbolo : rs[3][i][5], precio : rs[3][i][6], monto_total : rs[3][i][7], url : rs[3][i][8], tienda_producto_id : rs[3][i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaFavoritaListar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pDestiendaFavoritaListar) }){
        this.jpo.get("destiendaFavoritaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {tienda_id : rs[0][0], categoria_id : rs[0][1], categoria_icono : rs[0][2], nombre : rs[0][3], telefono : rs[0][4], direccion : rs[0][5], longitud : rs[0][6], latitud : rs[0][7], estado : rs[0][8]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}