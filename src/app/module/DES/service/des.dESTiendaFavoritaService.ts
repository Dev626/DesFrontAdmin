import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDestiendaFavoritaEliminar {resp_estado : number; resp_mensaje : string};
export class pDestiendaFavoritaRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pDestiendaFavoritaListar {tienda_id : number; categoria_id : number; categoria_icono : string; nombre : string; telefono : string; direccion : string; longitud : number; latitud : number; estado : number};
export class pDestiendaFavoritaObtener {tienda_id : number};

export class DESTiendaFavoritaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESTiendaFavoritaServiceImp");
    }

    destiendaFavoritaEliminar(fields : {
        usuario_id ?: number,
        tienda_id ?: number
    }, call ?: { (resp: pDestiendaFavoritaEliminar) }){
        this.jpo.get("destiendaFavoritaEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaFavoritaEliminar();
                        if(rs){
                            out.resp_estado = rs[0];
                            out.resp_mensaje = rs[1];
                        }
                    call(out);
                }
            }
        });
    }

    destiendaFavoritaRegistrar(fields : {
        usuario_id ?: number,
        tienda_id ?: number
    }, call ?: { (resp: pDestiendaFavoritaRegistrar) }){
        this.jpo.get("destiendaFavoritaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDestiendaFavoritaRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

    destiendaFavoritaListar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pDestiendaFavoritaListar[]) }){
        this.jpo.get("destiendaFavoritaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({tienda_id : rs[i][0], categoria_id : rs[i][1], categoria_icono : rs[i][2], nombre : rs[i][3], telefono : rs[i][4], direccion : rs[i][5], longitud : rs[i][6], latitud : rs[i][7], estado : rs[i][8]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    destiendaFavoritaObtener(fields : {
        usuario_id ?: number,
        tienda_id ?: number
    }, call ?: { (resp: pDestiendaFavoritaObtener) }){
        this.jpo.get("destiendaFavoritaObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {tienda_id : rs[0][0]};
                        }
                    call(out);
                }
            }
        });
    }

}