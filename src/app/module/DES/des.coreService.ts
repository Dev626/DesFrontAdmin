import { Injectable } from '@angular/core';

@Injectable()
export class DESCoreService {

    public data : any = {};
    public config : any = {
        prefix: "des",
        no_image : "https://firebasestorage.googleapis.com/v0/b/stone-net-265023.appspot.com/o/OVN_PROD%2FDES%2Fno_product_image.png?alt=media&token=6e831865-becf-4452-b6c1-20c5f5b4ff35",
        horario_defecto : {
            41704 : { // lunes
                seleccionado : true,
                inicio : {
					"hour"	: 8,
					"minute": 0
                },
                fin : {
					"hour"	: 8,
					"minute": 0
				}
            }
        },
        categoria_producto_estado : {
            activo : 41695
        },
        estado_pedido : {
            registrado      : 41688,
            recepcionado    : 41689,
            atendido        : 41690,
            cancelado       : 41698,
            entregado       : 41699
        },
        tipo_direccion : {
            casa : 41712
        },
        rol_id : {
            des_seller : "des_seller",
            des_client : "des_client"
        }
    };

}