import { Jpo, JpoError } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface desstoreProductVariantList_response {total ?: number};
export interface desstoreProductVariantList_variants {store_product_variant_id ?: number, store_product_id ?: number, size_id ?: number, colour_id ?: number, indicador_stock ?: boolean, user_registration_id ?: number, registration_date ?: Date, user_modification_id ?: number, modification_date ?: Date, catalogo_size ?: string, catalogo_colour ?: string, colour_data ?: any, sale_price ?: number};
export class pDesstoreProductVariantList {response : desstoreProductVariantList_response; variants : desstoreProductVariantList_variants[]};
export class pGescatalogoListarAllByParent {catalogo_id : number; catalogo_padre_id : number; unidad_negocio_id : number; descripcion : string; descricion_larga : string; estado : boolean; variable_1 : string; variable_2 : any; variable_3 : number; codigo : string; alias : string};

export class DESProductVariantServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESProductVariantServiceImp");
    }

    desstoreProductVariantList(fields : {
        store_product_variant_id ?: number,
        store_product_id ?: number,
        tienda_id ?: number,
        store_subcategory_id ?: number,
        size_id ?: number,
        colour_id ?: number,
        indicador_stock ?: string,
        user_registration_id ?: number,
        registration_date_from ?: string,
        registration_date_to ?: string,
        user_modification_id ?: number,
        modification_date_from ?: string,
        modification_date_to ?: string,
        pf_page ?: number,
        pf_size ?: number
    }, call ? : { (resp: pDesstoreProductVariantList) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("desstoreProductVariantList",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDesstoreProductVariantList();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.variants = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.variants.push({store_product_variant_id : rs[1][i][0], store_product_id : rs[1][i][1], size_id : rs[1][i][2], colour_id : rs[1][i][3], indicador_stock : (rs[1][i][4] == "true" || rs[1][i][4] == "1")?true:false, user_registration_id : rs[1][i][5], registration_date : (rs[1][i][6])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][6]):null, user_modification_id : rs[1][i][7], modification_date : (rs[1][i][8])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][8]):null, catalogo_size : rs[1][i][9], catalogo_colour : rs[1][i][10], colour_data : (rs[1][i][11])?JSON.parse(rs[1][i][11]):null, sale_price : rs[1][i][12]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gescatalogoListarAllByParent(fields : {
        catalogo_id ?: number
    }, call ? : { (resp: pGescatalogoListarAllByParent[]) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("gescatalogoListarAllByParent",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({catalogo_id : rs[i][0], catalogo_padre_id : rs[i][1], unidad_negocio_id : rs[i][2], descripcion : rs[i][3], descricion_larga : rs[i][4], estado : (rs[i][5] == "true" || rs[i][5] == "1")?true:false, variable_1 : rs[i][6], variable_2 : (rs[i][7])?JSON.parse(rs[i][7]):null, variable_3 : rs[i][8], codigo : rs[i][9], alias : rs[i][10]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}