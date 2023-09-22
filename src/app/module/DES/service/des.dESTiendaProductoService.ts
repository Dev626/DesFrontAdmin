import { Jpo, JpoError } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDestiendaProductoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDestiendaProductoEditar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDestiendaProductoObtener {tienda_producto_id : number; categoria_producto_id : number; nombre : string; descripcion : string; precio : number; fotos : any; indicador_stock : boolean; stock : number; stock_usado : number; sku : string; fecha_vencimiento : Date; store_subcategory_id : number; short_desc : string; addtional_info : string; shipp_returns : string; sale_price : number};
export interface destiendaProductoListar_response {total ?: number};
export interface destiendaProductoListar_tienda_productos {tienda_producto_id ?: number, tienda_id ?: number, categoria_producto_id ?: number, nombre ?: string, descripcion ?: string, precio ?: number, indicador_stock ?: boolean, stock ?: number, stock_usado ?: number, fecha_ultimo_uso ?: Date, thumbnail_url ?: string, estado ?: number, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string, fecha_registro ?: Date, usuario_modificacion_id ?: number, usuario_modificacion_nombres ?: string, usuario_modificacion_apellidos ?: string, fecha_modificacion ?: Date, sku ?: string, fecha_vencimiento ?: Date, store_subcategory_id ?: number, short_desc ?: string, addtional_info ?: string, shipp_returns ?: string, sale_price ?: number};
export class pDestiendaProductoListar {response : destiendaProductoListar_response; tienda_productos : destiendaProductoListar_tienda_productos[]};
export class pDestiendaProductoEliminar {resp_estado : number; resp_mensaje : string};
export class pDestiendaProductoAdjuntoEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class DESTiendaProductoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESTiendaProductoServiceImp");
    }

    destiendaProductoRegistrar(fields : {
        tienda_id ?: number,
        categoria_producto_id ?: number,
        descripcion ?: string,
        precio ?: number,
        usuario_registro_id ?: number,
        nombre ?: string,
        indicador_stock ?: string,
        sku ?: string,
        fecha_vencimiento ?: string,
        store_subcategory_id ?: number,
        short_desc ?: string,
        addtional_info ?: string,
        shipp_returns ?: string,
        sale_price ?: number,
        stock ?: number,
        fotos ?: string
    }, call ? : { (resp: pDestiendaProductoRegistrar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoRegistrar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaProductoRegistrar();
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

    destiendaProductoEditar(fields : {
        tienda_producto_id ?: number,
        tienda_id ?: number,
        categoria_producto_id ?: number,
        descripcion ?: string,
        precio ?: number,
        usuario_modificacion_id ?: number,
        nombre ?: string,
        indicador_stock ?: string,
        sku ?: string,
        fecha_vencimiento ?: string,
        store_subcategory_id ?: number,
        short_desc ?: string,
        addtional_info ?: string,
        shipp_returns ?: string,
        sale_price ?: number,
        stock ?: number,
        fotos ?: string,
        ref_store_product_variant ?: string
    }, call ? : { (resp: pDestiendaProductoEditar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoEditar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaProductoEditar();
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

    destiendaProductoObtener(fields : {
        tienda_producto_id ?: number
    }, call ? : { (resp: pDestiendaProductoObtener) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoObtener",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {tienda_producto_id : rs[0][0], categoria_producto_id : rs[0][1], nombre : rs[0][2], descripcion : rs[0][3], precio : rs[0][4], fotos : (rs[0][5])?JSON.parse(rs[0][5]):null, indicador_stock : (rs[0][6] == "true" || rs[0][6] == "1")?true:false, stock : rs[0][7], stock_usado : rs[0][8], sku : rs[0][9], fecha_vencimiento : (rs[0][10])?this.ohService.getOH().getUtil().dateStringtoDate(rs[0][10]):null, store_subcategory_id : rs[0][11], short_desc : rs[0][12], addtional_info : rs[0][13], shipp_returns : rs[0][14], sale_price : rs[0][15]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaProductoListar(fields : {
        tienda_producto_id ?: number,
        tienda_id ?: number,
        categoria_producto_id ?: number,
        nombre ?: string,
        descripcion ?: string,
        precio_min ?: number,
        precio_max ?: number,
        estado ?: number,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        catalogo_id ?: number,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        sku ?: string,
        fecha_vencimiento_from ?: string,
        fecha_vencimiento_to ?: string,
        store_subcategory_id ?: number,
        short_desc ?: string,
        addtional_info ?: string,
        shipp_returns ?: string,
        sale_price_min ?: number,
        sale_price_max ?: number,
        page ?: number,
        size ?: number
    }, call ? : { (resp: pDestiendaProductoListar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoListar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaProductoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.tienda_productos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.tienda_productos.push({tienda_producto_id : rs[1][i][0], tienda_id : rs[1][i][1], categoria_producto_id : rs[1][i][2], nombre : rs[1][i][3], descripcion : rs[1][i][4], precio : rs[1][i][5], indicador_stock : (rs[1][i][6] == "true" || rs[1][i][6] == "1")?true:false, stock : rs[1][i][7], stock_usado : rs[1][i][8], fecha_ultimo_uso : (rs[1][i][9])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][9]):null, thumbnail_url : rs[1][i][10], estado : rs[1][i][11], usuario_registro_id : rs[1][i][12], usuario_registro_nombres : rs[1][i][13], usuario_registro_apellidos : rs[1][i][14], fecha_registro : (rs[1][i][15])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][15]):null, usuario_modificacion_id : rs[1][i][16], usuario_modificacion_nombres : rs[1][i][17], usuario_modificacion_apellidos : rs[1][i][18], fecha_modificacion : (rs[1][i][19])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][19]):null, sku : rs[1][i][20], fecha_vencimiento : (rs[1][i][21])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][21]):null, store_subcategory_id : rs[1][i][22], short_desc : rs[1][i][23], addtional_info : rs[1][i][24], shipp_returns : rs[1][i][25], sale_price : rs[1][i][26]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaProductoEliminar(fields : {
        tienda_producto_id ?: number,
        usuario_modificacion_id ?: number
    }, call ? : { (resp: pDestiendaProductoEliminar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoEliminar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaProductoEliminar();
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

    destiendaProductoAdjuntoEliminar(fields : {
        tienda_producto_id ?: number,
        usuario_id ?: number,
        adjunto_id ?: number
    }, call ? : { (resp: pDestiendaProductoAdjuntoEliminar) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("destiendaProductoAdjuntoEliminar",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaProductoAdjuntoEliminar();
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
