import { Jpo, JpoError } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export interface desbannerList_response {total ?: number};
export interface desbannerList_banners {banner_id ?: number, title ?: string, subtitle ?: string, image_bg ?: string, button_text ?: string, button_link ?: string, tienda_id ?: number, active ?: boolean, user_registration_id ?: number, registration_date ?: Date, user_modification_id ?: number, modification_date ?: Date, alias ?: string, adjunto_id ?: number, imagen ?: any};
export class pDesbannerList {response : desbannerList_response; banners : desbannerList_banners[]};
export class pDesbannerRegister {resp_new_id : number; resp_result : number; resp_message : string};
export class pDesbannerEdit {resp_new_id : number; resp_result : number; resp_message : string};

export class DESBannerServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESBannerServiceImp");
    }

    desbannerList(fields : {
        banner_id ?: number,
        title ?: string,
        subtitle ?: string,
        image_bg ?: string,
        button_text ?: string,
        button_link ?: string,
        tienda_id ?: number,
        active ?: string,
        user_registration_id ?: number,
        registration_date_from ?: string,
        registration_date_to ?: string,
        user_modification_id ?: number,
        modification_date_from ?: string,
        modification_date_to ?: string,
        pf_page ?: number,
        pf_size ?: number
    }, call ? : { (resp: pDesbannerList) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("desbannerList",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDesbannerList();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.banners = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.banners.push({banner_id : rs[1][i][0], title : rs[1][i][1], subtitle : rs[1][i][2], image_bg : rs[1][i][3], button_text : rs[1][i][4], button_link : rs[1][i][5], tienda_id : rs[1][i][6], active : (rs[1][i][7] == "true" || rs[1][i][7] == "1")?true:false, user_registration_id : rs[1][i][8], registration_date : (rs[1][i][9])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][9]):null, user_modification_id : rs[1][i][10], modification_date : (rs[1][i][11])?this.ohService.getOH().getUtil().dateStringtoDate(rs[1][i][11]):null, alias : rs[1][i][12], adjunto_id : rs[1][i][13], imagen : (rs[1][i][14])?JSON.parse(rs[1][i][14]):null});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    desbannerRegister(fields : {
        title ?: string,
        subtitle ?: string,
        image_bg ?: string,
        button_text ?: string,
        button_link ?: string,
        tienda_id ?: number,
        active ?: string,
        user_registration_id ?: number,
        alias ?: string,
        imagen ?: string
    }, call ? : { (resp: pDesbannerRegister) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("desbannerRegister",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDesbannerRegister();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_result = rs[1];
                            out.resp_message = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    desbannerEdit(fields : {
        banner_id ?: number,
        title ?: string,
        subtitle ?: string,
        image_bg ?: string,
        button_text ?: string,
        button_link ?: string,
        tienda_id ?: number,
        active ?: string,
        user_modification_id ?: number,
        alias ?: string,
        imagen ?: string
    }, call ? : { (resp: pDesbannerEdit) }, handlerError ?: { (resp: JpoError) }){
        this.jpo.get("desbannerEdit",{
            fields : fields,
            handlerError : handlerError,
            response : (rs) => {
                if(call){
                    var out = new pDesbannerEdit();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_result = rs[1];
                            out.resp_message = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}
