import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDespedidoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string; resp_producto_validar : string};
export interface despedidoClienteListar_response {total ?: number, fecha_actual ?: Date};
export interface despedidoClienteListar_listapedidos {pedido_id ?: number, categoria_icono ?: string, cliente ?: string, tienda_nombre ?: string, fecha_registro ?: Date, total ?: number, estado ?: number};
export class pDespedidoClienteListar {response : despedidoClienteListar_response; listapedidos : despedidoClienteListar_listapedidos[]};
export class pDespedidoEditarEstado {resp_estado : number; resp_mensaje : string};
export class pDespedidoClienteBuscar {tienda_id : number; nombre : string; categoria_id : number; categoria_nombre : string; categoria_icono : string; telefono : string; latitud : string; longitud : string; distancia : number; indicador_disponible : boolean; empresa_logo_url : string};
export interface despedidoTiendaProductoListar_resultado {total ?: number};
export interface despedidoTiendaProductoListar_productos {tienda_producto_id ?: number, producto_nombre ?: string, producto_descripcion ?: string, precio ?: number, url ?: string, indicador_stock ?: boolean, stock_disponible ?: number};
export class pDespedidoTiendaProductoListar {resultado : despedidoTiendaProductoListar_resultado; productos : despedidoTiendaProductoListar_productos[]};
export class pDespedidoTiendaProductoObtener {tienda_producto_id : number; producto_nombre : string; producto_descripcion : string; precio : number; url : string; indicador_stock : boolean; stock_disponible : number; tienda_nombre : string; simbolo : string};
export class pDespedidoTiendaProductoFotoListar {adjunto_id : number; url : string; thumbnail_url : string};

export class DESPedidoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESPedidoServiceImp");
    }

    despedidoRegistrar(fields : {
        tienda_id ?: number,
        usuario_id ?: number,
        usuario_nombres ?: string,
        usuario_apellido_paterno ?: string,
        usuario_registro_id ?: number,
        usuario_direccion ?: string,
        usuario_longitud ?: number,
        usuario_latitud ?: number,
        usuario_telefono ?: string,
        pedido_detalle ?: string,
        usuario_direccion_id ?: number,
        medio_pago ?: number,
        monto_efectivo ?: number,
        tarjeta_id ?: number,
        banco_id ?: number,
        billetera_id ?: number,
        tipo_entrega ?: string,
        tipo_atencion ?: string,
        descripcion ?: string
    }, call ?: { (resp: pDespedidoRegistrar) }){
        this.jpo.get("despedidoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDespedidoRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                            out.resp_producto_validar = rs[3];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    despedidoObtener(call ?: any){
        this.jpo.get("despedidoObtener",{
            response : (rs) => {
                if(call){
                   call(rs);
                }
            },
            showLoader : true
        });
    }

    despedidoClienteListar(fields : {
        usuario_id ?: number,
        estado ?: number,
        pedido_id ?: number,
        tienda_nombre ?: string,
        cliente ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDespedidoClienteListar) }){
        this.jpo.get("despedidoClienteListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDespedidoClienteListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0], fecha_actual : (rs[0][0][1])?new Date(rs[0][0][1]):null};
                        }
                        if(rs[1]){
                            out.listapedidos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.listapedidos.push({pedido_id : rs[1][i][0], categoria_icono : rs[1][i][1], cliente : rs[1][i][2], tienda_nombre : rs[1][i][3], fecha_registro : (rs[1][i][4])?new Date(rs[1][i][4]):null, total : rs[1][i][5], estado : rs[1][i][6]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    despedidoEditarEstado(fields : {
        pedido_id ?: number,
        estado ?: number,
        usuario_modificacion_id ?: number,
        comentario ?: string
    }, call ?: { (resp: pDespedidoEditarEstado) }){
        this.jpo.get("despedidoEditarEstado",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDespedidoEditarEstado();
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

    despedidoClienteBuscar(fields : {
        unidad_negocio_id ?: number,
        latitud ?: string,
        longitud ?: string,
        distancia ?: number,
        tienda_nombre ?: string,
        indicador_disponible ?: string,
        categoria_id ?: number
    }, call ?: { (resp: pDespedidoClienteBuscar[]) }){
        this.jpo.get("despedidoClienteBuscar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({tienda_id : rs[i][0], nombre : rs[i][1], categoria_id : rs[i][2], categoria_nombre : rs[i][3], categoria_icono : rs[i][4], telefono : rs[i][5], latitud : rs[i][6], longitud : rs[i][7], distancia : rs[i][8], indicador_disponible : (rs[i][9] == "true" || rs[i][9] == "1")?true:false, empresa_logo_url : rs[i][10]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    despedidoTiendaProductoListar(fields : {
        tienda_id ?: number,
        nombre ?: string,
        descripcion ?: string,
        indicador_stock ?: string,
        precio_minimo ?: number,
        precio_maximo ?: number,
        orden_tipo ?: number,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pDespedidoTiendaProductoListar) }){
        this.jpo.get("despedidoTiendaProductoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDespedidoTiendaProductoListar();
                        if(rs[0] && rs[0][0]){
                            out.resultado = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.productos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.productos.push({tienda_producto_id : rs[1][i][0], producto_nombre : rs[1][i][1], producto_descripcion : rs[1][i][2], precio : rs[1][i][3], url : rs[1][i][4], indicador_stock : (rs[1][i][5] == "true" || rs[1][i][5] == "1")?true:false, stock_disponible : rs[1][i][6]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    despedidoTiendaProductoObtener(fields : {
        tienda_producto_id ?: number
    }, call ?: { (resp: pDespedidoTiendaProductoObtener) }){
        this.jpo.get("despedidoTiendaProductoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {tienda_producto_id : rs[0][0], producto_nombre : rs[0][1], producto_descripcion : rs[0][2], precio : rs[0][3], url : rs[0][4], indicador_stock : (rs[0][5] == "true" || rs[0][5] == "1")?true:false, stock_disponible : rs[0][6], tienda_nombre : rs[0][7], simbolo : rs[0][8]};
                        }
                    call(out);
                }
            }
        });
    }

    despedidoTiendaProductoFotoListar(fields : {
        tienda_producto_id ?: number
    }, call ?: { (resp: pDespedidoTiendaProductoFotoListar[]) }){
        this.jpo.get("despedidoTiendaProductoFotoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({adjunto_id : rs[i][0], url : rs[i][1], thumbnail_url : rs[i][2]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}