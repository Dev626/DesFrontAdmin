import { Jpo } from "@ovenfo/framework/lib/ohCore/services/jpo/oh.jpo";
import { OHService } from "@ovenfo/framework";

export class pDesusuarioRegistrarTiendaNuevo {estado : number; mensaje : string};
export class pDesusuarioDireccionListar {usuario_id : number; nombres : string; apellido_paterno : string};

export class DESUsuarioServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnDES","DES","module.des","DESUsuarioServiceImp");
    }

    desusuarioRegistrarTiendaNuevo(fields : {
        razon_social ?: string,
        nombre ?: string,
        apellido_paterno ?: string,
        apellido_materno ?: string,
        correo ?: string,
        clave ?: string,
        sistema_id ?: number,
        unidad_negocio_id ?: number
    }, call ?: { (resp: pDesusuarioRegistrarTiendaNuevo) }){
        this.jpo.get("desusuarioRegistrarTiendaNuevo",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDesusuarioRegistrarTiendaNuevo();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    desusuarioDireccionListar(fields : {
        unidad_negocio_id ?: number,
        telefono ?: string
    }, call ?: { (resp: pDesusuarioDireccionListar[]) }){
        this.jpo.get("desusuarioDireccionListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({usuario_id : rs[i][0], nombres : rs[i][1], apellido_paterno : rs[i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}