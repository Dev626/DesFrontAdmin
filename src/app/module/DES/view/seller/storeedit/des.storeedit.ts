import { Component, AfterViewInit, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService, OHService } from '@ovenfo/framework';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { DESCategoriaServiceJPO, pDescategoriaListarDisponibles } from '@service/des.dESCategoriaService';
import { DESTiendaServiceJPO, pDestiendaRegistrar, pDestiendaObtener, pDestiendaEditarEstado, pDestiendaEditar, pDestiendaAdjuntoEliminar } from '@service/des.dESTiendaService';
import { pDestiendaProductoListar, pDestiendaProductoRegistrar, DESTiendaProductoServiceJPO, pDestiendaProductoEliminar, pDestiendaProductoObtener, pDestiendaProductoEditar, pDestiendaProductoAdjuntoEliminar } from '@service/des.dESTiendaProductoService';
import { DESCategoriaProductoServiceJPO, pDescategoriaProductoComboListar } from '@service/des.dESCategoriaProductoService';
import { DESBancoServiceJPO, pDesbancoListar } from '@service/des.dESBancoService';
import { DESTarjetaServiceJPO, pDestarjetaListar } from '@service/des.dESTarjetaService';
import { DESBilleteraServiceJPO, pDesbilleteraListar } from '@service/des.dESBilleteraService';
import { ADMUsuarioServiceJPO, pSegusuarioListar } from 'src/app/module/ADM/service/adm.aDMUsuarioService';
import { DESBannerServiceJPO, pDesbannerList, pDesbannerRegister, pDesbannerEdit } from '@service/des.dESBannerService';
import { DESProductVariantServiceJPO, pDesstoreProductVariantList, pGescatalogoListarAllByParent } from '@service/des.dESProductVariantService';

@Component({
  templateUrl: './des.storeedit.html',
  styleUrls: ['./../../../css/des.structure.css']
})
export class Storeedit extends DESBase implements OnInit, AfterViewInit, OnDestroy {

  private dESBancoService: DESBancoServiceJPO;
  private dESBannerService: DESBannerServiceJPO
  private dESTiendaService: DESTiendaServiceJPO;
  private dESTarjetaService: DESTarjetaServiceJPO;
  private aDMUsuarioService: ADMUsuarioServiceJPO;
  private dESCategoriaService: DESCategoriaServiceJPO;
  private dESBilleteraService: DESBilleteraServiceJPO;
  private dESProductVariantService: DESProductVariantServiceJPO
  private dESTiendaProductoService: DESTiendaProductoServiceJPO;
  private dESCategoriaProductoService: DESCategoriaProductoServiceJPO;
  private precargaObtener: Promise<any>;
  private precargaTarjetas: Promise<any>;
  private precargaBancos: Promise<any>;
  private precargaBilleteras: Promise<any>;
  private precargaTallas: Promise<any>;
  private precargaColores: Promise<any>;



  configFotoTienda: any = {
    cantidad: 1
  };
  configFotoBanner: any = {
    cantidad: 1
  };

  item: any = {};
  pagin: any
  filter: any
  bancos: any
  tallas: any
  colores: any
  horario: any
  tarjetas: any
  clientes: any = []
  edit_mode: boolean
  direccion: any = ""
  mapa_zoom: number = 13
  medio_pago: any
  billeteras: any
  nac_activo: number
  categorias: any = []
  configFoto: any = {}
  itemBanner: any = {}
  pagin_banner: any
  url_producto: any
  tienda_nueva: boolean
  itemProducto: any = {}
  filter_banner: any
  foto_cargando: boolean;
  item_producto: any = {};
  tienda_banners: any = []
  itemsVariantes: any[] = [];
  tienda_productos: any = []
  estado_productos: any = {}
  coloresDisponibes: any[] = [];
  foto_cargandoTienda: boolean;
  foto_cargandoBanner: boolean;
  productos_categoria: any = [];
  productos_categoria_fotos: any = [];


  constructor(private ohService: OHService, public override cse: CoreService, public override dcs: DESCoreService, private zone: NgZone, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    super(ohService, cse, dcs)

    this.dESBancoService = new DESBancoServiceJPO(ohService);
    this.dESBannerService = new DESBannerServiceJPO(ohService)
    this.dESTiendaService = new DESTiendaServiceJPO(ohService);
    this.aDMUsuarioService = new ADMUsuarioServiceJPO(ohService)
    this.dESTarjetaService = new DESTarjetaServiceJPO(ohService);
    this.dESBilleteraService = new DESBilleteraServiceJPO(ohService);
    this.dESCategoriaService = new DESCategoriaServiceJPO(ohService);
    this.dESTiendaProductoService = new DESTiendaProductoServiceJPO(ohService);
    this.dESProductVariantService = new DESProductVariantServiceJPO(ohService)
    this.dESCategoriaProductoService = new DESCategoriaProductoServiceJPO(ohService);

    this.precarga.then(() => {
      this.item.latitud = this.dcs.data.un_config_format.default_gps_latitude
      this.item.longitud = this.dcs.data.un_config_format.default_gps_longitude

      if (this.cse.data.user.plan) {
        let it = this.cse.data.user.plan.find(it => it.id == 'des_producto_carga')
        if (it && it.configuracion) {
          this.configFoto.cantidad = it.configuracion.cantidad
        }
      } else {
        this.configFoto.cantidad = 1
      }

      this.estado_productos = Object.assign(dcs.data.estado, dcs.data.estado_categoria_producto)
    })

    if (!this.bancos) {
      this.desbancoListar()
    }
    if (!this.tarjetas) {
      this.destarjetaListar()
    }
    if (!this.billeteras) {
      this.desbilleteraListar()
    }
    if (!this.tallas) {
      this.destallaListar()
    }
    if (!this.colores) {
      this.descolorListar()
    }

    this.descategoriaListarDisponibles()

    this.filtroTab()
  }

  private convertirHora(tiempo) {
    let _minuto = tiempo % 60
    return {
      hour: (tiempo - _minuto) / 60,
      minute: _minuto
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params['id']) {
        this.item.tienda_id = Number(params['id'])
        this.destiendaObtener()
        this.nac_activo = 2
        this.homologarEditar()
        //this.destiendaProductoListar();
      } else {
        this.nac_activo = 1
        let seller = this.storage.item("OVN_DES_DATA", "SELLER_NEW")
        if (seller) {
          this.tienda_nueva = true
          this.item.nombre = seller.razon_comercial
          this.storage.subtract("OVN_DES_DATA", "SELLER_NEW")
        }
        this.item.indicador_entrega = true
        this.item.indicador_recojo = true
        this.item.fotos = []

        if (this.cse.tieneRol(['des_admin'])) {
          this.segusuarioListar()
        }
        this.cambiarEdicion()

      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  segusuarioListar() {
    this.aDMUsuarioService.segusuarioListar({
      roles: JSON.stringify([{ "id": this.dcs.config.rol_id.des_seller }])
    }, (resp: pSegusuarioListar) => {
      for (var i in resp.lista) {
        if (resp.lista[i].empresa_id) {
          this.clientes.push({
            empresa_id: resp.lista[i].empresa_id,
            cliente: resp.lista[i].razon_social + " (" + resp.lista[i].nombres + " " + resp.lista[i].apellido_paterno + " " + resp.lista[i].apellido_materno + ")"
          })
        }
      }
      console.log(this.clientes)
    });
  }

  private homologarEditar() {
    Promise.all([this.precargaObtener, this.precargaTarjetas, this.precargaBancos, this.precargaBilleteras, this.precargaColores, this.precargaTallas]).then(values => {

      let _horarios = this.item.horarios.filter(it => !it.seleccionado || it.seleccionado != null)

      if (_horarios && _horarios.length > 0) {
        this.item.indicador_horario = 1
        let _horarios = []
        for (var i in this.dcs.data.catalogo.dia_semana) {

          let _config = JSON.parse(this.dcs.data.catalogo.dia_semana[i].variable_2).horario_defecto
          let _id = this.dcs.data.catalogo.dia_semana[i].id

          let _encontrado = this.item.horarios.find(it => it.tipo_dia_id == _id)

          _horarios.push({
            tipo_dia_id: _id,
            nombre: this.dcs.data.catalogo.dia_semana[i].descripcion,
            seleccionado: _encontrado ? true : false,
            hora_inicio: _encontrado ? this.convertirHora(_encontrado.hora_inicio) : _config.inicio,
            hora_fin: _encontrado ? this.convertirHora(_encontrado.hora_fin) : _config.fin
          })

        }

        this.item.horarios = _horarios

      }

      if (this.item.pago) {

        console.log(this.tarjetas)

        console.log(this.bancos)

        console.log(this.billeteras)

        let _pago = {
          tarjetas_seleccionadas: "",
          efectivo_maximo: this.item.pago.efectivo_maximo,
          indicador_efectivo: this.item.pago.indicador_efectivo,
          indicador_tarjeta: this.item.pago.indicador_tarjeta,
          indicador_transferencia: this.item.pago.indicador_transferencia,
          indicador_billetera: this.item.pago.indicador_billetera,
          tarjetas: this.tarjetas ? JSON.parse(JSON.stringify(this.tarjetas)) : [],
          bancos: this.bancos ? JSON.parse(JSON.stringify(this.bancos)) : [],
          billeteras: this.billeteras ? JSON.parse(JSON.stringify(this.billeteras)) : []
        }

        let _seleccionados = []
        _pago.tarjetas.forEach(element => {
          if (this.item.pago.tarjetas && this.item.pago.tarjetas.length > 0) {
            let encontro = this.item.pago.tarjetas.find(it => it.tarjeta_id == element.tarjeta_id)
            if (encontro) {
              element.seleccionado = true
              _seleccionados.push(encontro.tarjeta_id)
            }
          }
        });

        _pago.tarjetas_seleccionadas = _seleccionados.length == 0 ? null : _seleccionados.join(",")

        _pago.bancos.forEach(element => {
          if (this.item.pago.bancos && this.item.pago.bancos.length > 0) {
            let encontro = this.item.pago.bancos.find(it => it.banco_id == element.banco_id)
            if (encontro) {
              element.seleccionado = true
              element.cuenta = encontro.cuenta
              element.cuenta_cci = encontro.cuenta_cci
            }
          }
        });

        _pago.billeteras.forEach(element => {
          if (this.item.pago.billeteras && this.item.pago.billeteras.length > 0) {
            let encontro = this.item.pago.billeteras.find(it => it.billetera_id == element.billetera_id)
            if (encontro) {
              element.seleccionado = true
              element.codigo = encontro.codigo
            }
          }
        });

        this.item.pago = _pago

      }

    })
  }

  cambiarEdicion() {
    this.edit_mode = true
  }

  getInput(input: any) {
    this.direccion = input
  }

  seleccionarPunto(event: any) {
    if (event.place_text) {
      this.item.direccion = event.place_text
    }
  }

  descategoriaListarDisponibles() {
    this.dESCategoriaService.descategoriaListarDisponibles((resp: pDescategoriaListarDisponibles[]) => {
      this.categorias = resp;
    });
  }

  grabar() {
    this.ohService.getOH().getUtil().confirm("Confirma crear una tienda", () => {
      if (this.item.tienda_id) {
        this.destiendaEditar();
      } else {
        this.destiendaRegistrar();
      }
    });
  }

  destiendaRegistrar() {

    this.dESTiendaService.destiendaRegistrar({
      unidad_negocio_id: this.cse.data.user.profile,
      nombre: this.item.nombre,
      empresa_id: this.cse.tieneRol(['des_admin']) ? this.item.empresa_id : this.cse.data.user.data.empresa_id,
      categoria_id: this.item.categoria_id,
      telefono: this.item.telefono,
      direccion: this.item.direccion,
      longitud: this.item.longitud,
      latitud: this.item.latitud,
      fotos: this.item.fotos ? JSON.stringify(this.item.fotos) : null,
      horarios: this.mapearHorario(this.item.horarios),
      medios_pago: this.mapearMedioPago(this.item.pago),
      usuario_registro_id: this.cse.data.user.data.userid,
      indicador_horario: this.item.indicador_horario,
      indicador_entrega: this.item.indicador_entrega ? '1' : '0',
      indicador_recojo: this.item.indicador_recojo ? '1' : '0'
    }, (resp: pDestiendaRegistrar) => {
      if (resp.resp_estado == 1) {
        this.ohService.getOH().getAd().success(resp.resp_mensaje);
        for (var i in this.item.fotos) {
          if (this.item.fotos[i].accion == 'N') {
            this.item.fotos[i].adjunto_id = true;
          }
        }
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        if (resp.resp_estado == 0) {
          this.ohService.getOH().getAd().error(resp.resp_mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_mensaje);
        }
      }
    });
  }

  destiendaEditar() {
    console.log(this.item.fotos)
    this.dESTiendaService.destiendaEditar({
      tienda_id: this.item.tienda_id,
      empresa_direccion_id: this.item.empresa_direccion_id,
      nombre: this.item.nombre,
      telefono: this.item.telefono,
      direccion: this.item.direccion,
      longitud: this.item.longitud,
      latitud: this.item.latitud,
      indicador_horario: this.item.indicador_horario,
      indicador_entrega: this.item.indicador_entrega ? '1' : '0',
      indicador_recojo: this.item.indicador_recojo ? '1' : '0',
      horarios: this.mapearHorario(this.item.horarios),
      fotos: this.item.fotos ? JSON.stringify(this.item.fotos) : null,
      medios_pago: this.mapearMedioPago(this.item.pago),
      categoria_id: this.item.categoria_id,
      usuario_modificacion_id: this.cse.data.user.data.userid
    }, (resp: pDestiendaEditar) => {
      if (resp.resp_estado == 1) {
        this.ohService.getOH().getAd().success(resp.resp_mensaje);
        for (var i in this.item.fotos) {
          if (this.item.fotos[i].accion == 'N') {
            this.item.fotos[i].adjunto_id = true;
          }
        }
        this.router.navigate(['../../'], { relativeTo: this.route });
      } else {
        if (resp.resp_estado == 0) {
          this.ohService.getOH().getAd().error(resp.resp_mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_mensaje);
        }
      }
    });
  }

  eventosFotoTienda($event) {
    $event.response.cargarAntes((files: any) => {
      this.foto_cargandoTienda = true;
    })
    $event.response.cargarFinalizado((cargado: boolean) => {
      this.foto_cargandoTienda = false;
    })
    $event.response.eliminarFoto((adjunto: any) => {
      if (adjunto.adjunto_id) {
        this.dESTiendaService.destiendaAdjuntoEliminar({
          tienda_id: this.item.tienda_id,
          usuario_id: this.cse.data.user.data.userid,
          adjunto_id: adjunto.adjunto_id
        }, (resp: pDestiendaAdjuntoEliminar) => {
        });
      }
    })
  }

  private mapearHorario(horarios: any) {
    let _horarios = null
    if (horarios && this.item.indicador_horario) {
      let _select = horarios.filter(it => it.seleccionado == true)
      if (_select && _select.length > 0) {
        _horarios = []
        for (var i in _select) {
          _horarios.push({
            tipo_dia_id: _select[i].tipo_dia_id,
            hora_inicio: _select[i].hora_inicio.hour * 60 + _select[i].hora_inicio.minute,
            hora_fin: _select[i].hora_fin.hour * 60 + _select[i].hora_fin.minute
          })
        }
      }
    }
    return JSON.stringify(_horarios)
  }

  private mapearMedioPago(pago: any) {
    if (pago && pago.tarjetas) {
      let _tarjetas = []
      pago.tarjetas.filter(it => it.seleccionado).forEach(item => {
        _tarjetas.push({
          tarjeta_id: item.tarjeta_id
        })
      });
      pago.tarjetas = _tarjetas
    }
    if (pago && pago.bancos) {
      let _bancos = []
      pago.bancos.filter(it => it.seleccionado).forEach(item => {
        _bancos.push({
          banco_id: item.banco_id,
          cuenta: item.cuenta,
          cuenta_cci: item.cuenta_cci
        })
      });
      pago.bancos = _bancos
    }
    if (pago && pago.billeteras) {
      let _billeteras = []
      pago.billeteras.filter(it => it.seleccionado).forEach(item => {
        _billeteras.push({
          billetera_id: item.billetera_id,
          codigo: item.codigo
        })
      });
      pago.billeteras = _billeteras
    }
    return JSON.stringify(pago)
  }

  destiendaObtener() {
    this.precargaObtener = new Promise<void>((resolve, reject) => {
      this.dESTiendaService.destiendaObtener({
        usuario_id: this.cse.data.user.data.userid,
        tienda_id: this.item.tienda_id
      }, (resp: pDestiendaObtener) => {
        if (resp) {
          console.log(resp)

          this.item = resp.tienda
          this.item.longitud = Number(this.item.longitud)
          this.item.latitud = Number(this.item.latitud)
          this.item.horarios = resp.horarios
          this.item.pago = resp.pago
          this.item.store_social_network = resp.store_social_network

          this.item.indicador_entrega = resp.tienda.indicador_entrega == '1' ? true : false
          this.item.indicador_recojo = resp.tienda.indicador_recojo == '1' ? true : false

          if (!(this.item.longitud && this.item.latitud && this.item.direccion)) {
            this.edit_mode = true
          }

          if (!resp.tienda.fotos) {
            this.item.fotos = []
          }


          this.buscar_whatsapp_compartir_url = this.obtenerTienda(resp.tienda.tienda_id)
          resolve()
        } else {
          this.router.navigate(['../../'], { relativeTo: this.route });
        }

      });
    })
  }

  descategoriaProductoComboListar() {
    this.dESCategoriaProductoService.descategoriaProductoComboListar({
      categoria_id: this.item.categoria_id
    }, (resp: pDescategoriaProductoComboListar) => {
      this.productos_categoria = resp.productos;
      this.productos_categoria_fotos = resp.fotos;
      for (var i in this.productos_categoria) {
        let itm = resp.fotos.find(it => it.categoria_producto_id == this.productos_categoria[i].categoria_producto_id)
        if (itm) {
          this.productos_categoria[i]['url'] = itm.url
        }
      }
    });
  }

  destiendaProductoListar() {
    this.dESTiendaProductoService.destiendaProductoListar({
      nombre: this.filter.fields.producto_nombre.value,
      estado: this.cse.params.estado.activo,
      tienda_id: this.item.tienda_id,
      page: this.pagin.page,
      size: this.pagin.size_rows
    }, (resp: pDestiendaProductoListar) => {
      console.log(resp)
      this.tienda_productos = resp.tienda_productos
      this.pagin.total = resp.response.total
    });
  }

  productoNuevoModal(modal: any) {
    this.url_producto = null
    this.itemProducto = {
      fotos: [],
      nombre: '',
      stock: 1,
      indicador_stock: false
    }
    if (this.item.categoria_indicador_producto) {
      this.descategoriaProductoComboListar();
    }
    this.modalService.open(modal, { size: 'xl' }).result.then((result) => { }, (reason) => { });
  }

  productoGrabar(modal) {
    this.ohService.getOH().getUtil().confirm("¿Confirma grabar el producto?", () => {
      if (this.itemProducto.tienda_producto_id) {
        this.destiendaProductoEditar(modal)
      } else {
        this.destiendaProductoRegistrar(modal)
      }
    })
  }

  formatDate(date: Date): string | null {
    if (date) {
      const formatted = this.ohService.getOH().getUtil().dateToString(date);
      return formatted;
    }
    return null;
  }

  destiendaProductoEditar(modal: any) {


    // this.itemProducto.sale_price || this.itemProducto.precio
    // this.itemProducto.descripcion || this.itemProducto.short_desc

    this.dESTiendaProductoService.destiendaProductoEditar({
      tienda_producto_id: this.itemProducto.tienda_producto_id, // Optional
      tienda_id: this.item.tienda_id, // Optional
      categoria_producto_id: this.itemProducto.categoria_producto_id, // Optional
      nombre: this.itemProducto.categoria_producto_id ? null : this.itemProducto.producto_hidden, // Optional
      descripcion: this.itemProducto.descripcion || this.itemProducto.short_desc, // Optional
      precio: this.itemProducto.precio, // Optional
      indicador_stock: this.itemProducto.indicador_stock ? '1' : '0', // Optional
      stock: this.itemProducto.stock, // Optional
      usuario_modificacion_id: this.cse.data.user.data.userid, // Optional
      fotos: this.itemProducto.fotos ? JSON.stringify(this.itemProducto.fotos) : null, // Optional
      sku: this.itemProducto.sku, // Optional
      fecha_vencimiento: this.formatDate(this.itemProducto.fecha_vencimiento), // Optional
      //store_subcategory_id: 0, // Optional
      short_desc: this.itemProducto.short_desc, // Optional
      addtional_info: this.itemProducto.addtional_info, // Optional
      shipp_returns: this.itemProducto.shipp_returns, // Optional
      sale_price: this.itemProducto.sale_price || this.itemProducto.precio, // Optional
      ref_store_product_variant: this.itemProducto.ref_store_product_variant ? JSON.stringify(this.itemProducto.ref_store_product_variant) : null, // Optional
    }, (resp: pDestiendaProductoEditar) => {
      if (resp.resp_estado == 1) {
        this.ohService.getOH().getAd().success(resp.resp_mensaje);
        for (var i in this.itemProducto.fotos) {
          if (this.itemProducto.fotos[i].accion == 'N') {
            this.itemProducto.fotos[i].adjunto_id = true;
          }
        }
        modal.close()
        this.destiendaProductoListar()
      } else {
        if (resp.resp_estado == 0) {
          this.ohService.getOH().getAd().error(resp.resp_mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_mensaje);
        }
      }
    });
  }

  destiendaProductoRegistrar(modal: any) {
    this.dESTiendaProductoService.destiendaProductoRegistrar({
      tienda_id: this.item.tienda_id, // Optional
      categoria_producto_id: this.itemProducto.categoria_producto_id, // Optional
      nombre: this.itemProducto.categoria_producto_id ? null : this.itemProducto.producto_hidden, // Optional
      descripcion: this.itemProducto.descripcion, // Optional
      precio: this.itemProducto.precio, // Optional
      indicador_stock: this.itemProducto.indicador_stock ? '1' : '0', // Optional
      stock: this.itemProducto.stock, // Optional
      usuario_registro_id: this.cse.data.user.data.userid, // Optional
      fotos: this.itemProducto.fotos ? JSON.stringify(this.itemProducto.fotos) : null, // Optional
      sku: this.itemProducto.sku, // Optional
      fecha_vencimiento: this.formatDate(this.itemProducto.fecha_vencimiento), // Optional
      //store_subcategory_id: 0, // Optional
      short_desc: this.itemProducto.short_desc, // Optional
      addtional_info: this.itemProducto.addtional_info, // Optional
      shipp_returns: this.itemProducto.shipp_returns, // Optional
      sale_price: this.itemProducto.sale_price || this.itemProducto.precio, // Optional
    }, (resp: pDestiendaProductoRegistrar) => {
      if (resp.resp_estado == 1) {
        this.ohService.getOH().getAd().success(resp.resp_mensaje);
        for (var i in this.itemProducto.fotos) {
          if (this.itemProducto.fotos[i].accion == 'N') {
            this.itemProducto.fotos[i].adjunto_id = true;
          }
        }
        modal.close()
        this.destiendaProductoListar()
      } else {
        if (resp.resp_estado == 0) {
          this.ohService.getOH().getAd().error(resp.resp_mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_mensaje);
        }
      }
    });
  }

  seleccionarCategoriaProducto() {
    if (this.itemProducto.categoria_producto_id) {
      let item = this.productos_categoria.find(it => it.categoria_producto_id == this.itemProducto.categoria_producto_id)
      if (item) {
        this.url_producto = item.url
      }
    }
  }

  alEscribir($event) {
    this.itemProducto.producto_hidden = $event
  }

  limpiarCategoriaProducto() {
    this.url_producto = null
  }

  eventosFotoProductos($event) {
    $event.response.cargarAntes((files: any) => {
      this.foto_cargando = true;
    })
    $event.response.cargarFinalizado((cargado: boolean) => {
      this.foto_cargando = false;
    })
    $event.response.eliminarFoto((adjunto: any) => {
      if (adjunto.adjunto_id) {
        this.dESTiendaProductoService.destiendaProductoAdjuntoEliminar({
          tienda_producto_id: this.itemProducto.tienda_producto_id,
          usuario_id: this.cse.data.user.data.userid,
          adjunto_id: adjunto.adjunto_id
        }, (resp: pDestiendaProductoAdjuntoEliminar) => {
        });
      }
    })
  }

  productoEditar(tienda_producto_id: number, modalProducto: any) {
    this.dESTiendaProductoService.destiendaProductoObtener({
      tienda_producto_id: tienda_producto_id
    }, (resp: pDestiendaProductoObtener) => {
      this.productoNuevoModal(modalProducto)
      resp.sale_price = resp.sale_price || resp.precio
      resp.descripcion = resp.descripcion || resp.short_desc
      this.itemProducto = resp

      if (!this.itemProducto.fotos) {
        this.itemProducto.fotos = []
      }

      this.itemProducto.producto_hidden = resp.nombre
    });
  }

  productoBorrar(tienda_producto_id: any) {
    this.ohService.getOH().getUtil().confirm("Confirma eliminar el producto", () => {
      this.dESTiendaProductoService.destiendaProductoEliminar({
        tienda_producto_id: tienda_producto_id,
        usuario_modificacion_id: this.cse.data.user.data.userid
      }, (resp: pDestiendaProductoEliminar) => {
        if (resp.resp_estado == 1) {
          this.ohService.getOH().getAd().success(resp.resp_mensaje);
          this.destiendaProductoListar()
        } else {
          if (resp.resp_estado == 0) {
            this.ohService.getOH().getAd().error(resp.resp_mensaje);
          } else {
            this.ohService.getOH().getAd().warning(resp.resp_mensaje);
          }
        }
      });
    })
  }

  filtroTab() {
    this.pagin = {
      page: 1,
      total: 0,
      size_rows: 10,
    };
    this.filter = {
      startList: false,
      field: {},
      fields: {
        producto_nombre: {
          label: "Producto",
          type: "",
          closeFilter: true
        }
      }
    };
    this.pagin_banner = {
      page: 1,
      total: 0,
      size_rows: 10,
    };
    this.filter_banner = {
      startList: false,
      field: {},
      fields: {
        producto_nombre: {
          label: "Producto",
          type: "",
          closeFilter: true
        }
      }
    };
  }

  cerrar() {
    this.ohService.getOH().getUtil().confirm("¿Confirma cerrar la tienda definitivamente?, no se podrá deshacer", () => {
      this.dESTiendaService.destiendaEditarEstado({
        tienda_id: this.item.tienda_id,
        estado: this.cse.params.estado.inactivo,
        usuario_modificacion_id: this.cse.data.user.data.userid
      }, (resp: pDestiendaEditarEstado) => {
        if (resp.resp_estado == 1) {
          this.ohService.getOH().getAd().success(resp.resp_mensaje);
          this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
          if (resp.resp_estado == 0) {
            this.ohService.getOH().getAd().error(resp.resp_mensaje);
          } else {
            this.ohService.getOH().getAd().warning(resp.resp_mensaje);
          }
        }
      });
    })
  }

  abrirHorario(modal: any) {
    if (!this.item.indicador_horario) {
      this.horario = {
        indicador_horario: 0,
        horarios: []
      }
      this.item.horarios = []
      this.item.indicador_horario = 0
    } else {
      this.horario = {
        indicador_horario: this.item.indicador_horario,
        horarios: JSON.parse(JSON.stringify(this.item.horarios))
      }
    }

    this.modalService.open(modal).result.then((result) => {
      if (result == "guardar") {
        this.item.horarios = JSON.parse(JSON.stringify(this.horario.horarios))
        this.item.indicador_horario = this.horario.indicador_horario
      }
    }, (reason) => { });

  }

  validarHorario() {
    if (this.horario.indicador_horario && this.horario.horarios.length == 0) {
      for (var i in this.dcs.data.catalogo.dia_semana) {
        let _config = JSON.parse(this.dcs.data.catalogo.dia_semana[i].variable_2).horario_defecto
        this.horario.horarios.push({
          tipo_dia_id: this.dcs.data.catalogo.dia_semana[i].id,
          nombre: this.dcs.data.catalogo.dia_semana[i].descripcion,
          seleccionado: _config.seleccionado,
          hora_inicio: _config.inicio,
          hora_fin: _config.fin
        })
      }
    }
  }

  formatHorario(hora) {
    return (hora.hour > 9 ? hora.hour : '0' + hora.hour) + ":" + (hora.minute > 9 ? hora.minute : '0' + hora.minute)
  }

  abirMedioPago(modalMedioPago: any) {

    if (!this.item.pago) {
      this.medio_pago = {
        tarjetas_seleccionadas: "",
        indicador_efectivo: false,
        indicador_tarjeta: false,
        indicador_transferencia: false,
        indicador_billetera: false
      }
    } else {
      this.medio_pago = JSON.parse(JSON.stringify(this.item.pago))
    }

    this.modalService.open(modalMedioPago).result.then((result) => {
      if (result == "guardar") {
        this.item.pago = JSON.parse(JSON.stringify(this.medio_pago))
      }
    }, (reason) => { });
  }

  private desbancoListar() {
    this.precargaBancos = new Promise<void>((resolve, reject) => {
      this.dESBancoService.desbancoListar({
      }, (resp: pDesbancoListar) => {
        this.bancos = resp.bancos
        resolve()
      });
    })
  }

  private destarjetaListar() {
    this.precargaTarjetas = new Promise<void>((resolve, reject) => {
      this.dESTarjetaService.destarjetaListar({
      }, (resp: pDestarjetaListar) => {
        this.tarjetas = resp.tarjetas
        resolve()
      });
    })
  }

  private desbilleteraListar() {
    this.precargaTarjetas = new Promise<void>((resolve, reject) => {
      this.dESBilleteraService.desbilleteraListar({
      }, (resp: pDesbilleteraListar) => {
        this.billeteras = resp.billeteras
        resolve()
      });
    })
  }

  pagoTarjetaValidar() {
    this.medio_pago.indicador_tarjeta = !this.medio_pago.indicador_tarjeta;
    if (this.medio_pago.indicador_tarjeta && !this.medio_pago.tarjetas && this.tarjetas) {
      this.medio_pago.tarjetas = JSON.parse(JSON.stringify(this.tarjetas))
    }
  }

  pagoBancoValidar() {
    this.medio_pago.indicador_transferencia = !this.medio_pago.indicador_transferencia;
    if (this.medio_pago.indicador_transferencia && this.bancos) {
      if (!this.medio_pago.bancos) {
        this.medio_pago.bancos = JSON.parse(JSON.stringify(this.bancos))
      }
    }
  }

  cambiarHorarioDia(horario: any) {
    horario.seleccionado = !horario.seleccionado
    if (horario.seleccionado) {
      if (!horario.hora_inicio) {
        horario.hora_inicio = {
          "hour": 8,
          "minute": 0
        }
      }
      if (!horario.hora_fin) {
        horario.hora_fin = {
          "hour": 20,
          "minute": 0
        }
      }
    }
  }

  seleccionarTarjeta() {
    let seleccionados = []
    for (var i in this.medio_pago.tarjetas) {
      if (this.medio_pago.tarjetas[i].seleccionado) {
        seleccionados.push(this.medio_pago.tarjetas[i].tarjeta_id)
      }
    }
    this.medio_pago.tarjetas_seleccionadas = seleccionados.length == 0 ? null : seleccionados.join(",")
  }

  pagoBilleteraValidar() {
    this.medio_pago.indicador_billetera = !this.medio_pago.indicador_billetera;
    if (this.medio_pago.indicador_billetera && this.billeteras) {
      if (!this.medio_pago.billeteras) {
        this.medio_pago.billeteras = JSON.parse(JSON.stringify(this.billeteras))
      }
    }
  }

  pegarQR(billetera: any) {
    billetera.codigo = "" + billetera.pre_codigo
    billetera.pre_codigo = ""
  }

  billetaQRleer(event: any, billetera: any) {
    event.response.returnValue((value: string) => {
      billetera.codigo = value
    });
    event.response.error((id: number, error: string) => {
      this.ohService.getOH().getAd().warning(error);
    });
  }

  desbannerList() {
    this.dESBannerService.desbannerList({
      // banner_id: null, // Optional
      // title: null, // Optional
      // subtitle: null, // Optional
      // image_bg: null, // Optional
      // button_text: null, // Optional
      // button_link: null, // Optional
      tienda_id: this.item.tienda_id,
      // active: null, // Optional
      // user_registration_id: null, // Optional
      // registration_date_from: null, // Optional
      // registration_date_to: null, // Optional
      // user_modification_id: null, // Optional
      // modification_date_from: null, // Optional
      // modification_date_to: null, // Optional
      pf_page: this.pagin_banner.page,
      pf_size: this.pagin_banner.size_rows
    }, (resp: pDesbannerList) => {
      this.tienda_banners = resp.banners;
    })
  }

  bannerEditar(banner: any, modalBanner: any) {
    this.dESBannerService.desbannerList({
      banner_id: this.item.banner_id, // Optional
    }, (resp: pDesbannerList) => {
      this.openModal(modalBanner)
      this.itemBanner = resp.banners[0]
      if (!this.itemBanner.imagen) {
        this.itemBanner.imagen = []
      }
    });
  }

  openModal(modal: any) {
    // this.item
    this.modalService.open(modal,{ size: 'xl' }).result.then((result) => { }, (reason) => { });
  }

  bannerGrabar(modal: any) {
    this.ohService.getOH().getUtil().confirm("¿Confirma grabar el banner?", () => {
      if (this.itemBanner.banner_id) {
        this.desbannerRegister(modal)
      } else {
        this.desbannerEdit(modal)
      }
    })
    console.log(this.itemBanner)
  }


  desbannerRegister(modal: any) {
    this.dESBannerService.desbannerRegister({
      alias: this.itemBanner.alias, // optional
      title: this.itemBanner.title, // optional
      subtitle: this.itemBanner.subtitle, // optional
      image_bg: this.itemBanner.image_bg, // optional
      button_text: this.itemBanner.button_text, // optional
      button_link: this.itemBanner.button_link, // optional
      tienda_id: this.itemBanner.tienda_id, // optional
      active: this.itemBanner.active, // optional
      user_registration_id: this.cse.data.user.data.userid,
      imagen: this.itemProducto.imagen ? JSON.stringify(this.itemProducto.imagen) : null // optional
    }, (resp: pDesbannerRegister) => {
      console.log(resp)
      if (resp.resp_result == 1) {
        modal.close()
        this.desbannerList()
      } else {
        if (resp.resp_result == 0) {
          this.ohService.getOH().getAd().error(resp.resp_message);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_message);
        }
      }
    })
  }

  desbannerEdit(modal: any) {
    this.dESBannerService.desbannerEdit({
      alias: this.itemBanner.alias, // optional
      banner_id: this.itemBanner.banner_id, // Optional
      title: this.itemBanner.title, // optional
      subtitle: this.itemBanner.subtitle, // optional
      image_bg: this.itemBanner.image_bg, // optional
      button_text: this.itemBanner.button_text, // optional
      button_link: this.itemBanner.button_link, // optional
      tienda_id: this.itemBanner.tienda_id, // optional
      active: this.itemBanner.active, // optional
      user_modification_id: this.cse.data.user.data.userid, // optional
      imagen: this.itemProducto.imagen ? JSON.stringify(this.itemProducto.imagen) : null // optional
    }, (resp: pDesbannerEdit) => {
      console.log(resp)
      this.desbannerList()
      if (resp.resp_result == 1) {
        modal.close()
      } else {
        if (resp.resp_result == 0) {
          this.ohService.getOH().getAd().error(resp.resp_message);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_message);
        }
      }
    })
  }

  eventoImagenBanner($event) {
    $event.response.cargarAntes((files: any) => {
      this.foto_cargandoBanner = true;
    })
    $event.response.cargarFinalizado((cargado: boolean) => {
      this.foto_cargandoBanner = false;
    })
    $event.response.eliminarFoto((adjunto: any) => {
      if (adjunto.adjunto_id) {
        // this.dESTiendaProductoService.destiendaProductoAdjuntoEliminar({
        //   tienda_producto_id: this.itemProducto.tienda_producto_id,
        //   usuario_id: this.cse.data.user.data.userid,
        //   adjunto_id: adjunto.adjunto_id
        // }, (resp: pDestiendaProductoAdjuntoEliminar) => {
        // });
      }
    })
  }

  private descolorListar() {
    this.precargaColores = new Promise<void>((resolve, reject) => {
      this.dESProductVariantService.gescatalogoListarAllByParent({
        catalogo_id: 62054 // Optional
      }, (resp: pGescatalogoListarAllByParent[]) => {
        console.log(resp)
        this.colores = resp
        resolve()
      })
    });
  }

  private destallaListar() {
    this.precargaTallas = new Promise<void>((resolve, reject) => {
      this.dESProductVariantService.gescatalogoListarAllByParent({
        catalogo_id: 62058 // Optional
      }, (resp: pGescatalogoListarAllByParent[]) => {
        console.log(resp)
        this.tallas = resp
        resolve()
      })
    })
  }

  productoVariantes(product: any, modal: any) {
    this.itemProducto = product
    console.log(this.itemProducto)
    this.dESProductVariantService.desstoreProductVariantList({
      store_product_id: product.tienda_producto_id, // Optional
      tienda_id: this.item.tienda_id,
    }, (resp: pDesstoreProductVariantList) => {
      this.itemsVariantes = resp.variants;
      // group by color
      let coloresUsed = [];
      this.itemsVariantes = Object.values(
        resp.variants.reduce((acc, current: any, index, array) => {
          current.from_db = true;
          acc[current.colour_id] = acc[current.colour_id] ?? [];
          acc[current.colour_id].push(current);
          if (index == array.length-1) {
            coloresUsed = Object.keys(acc);
          }
          return acc;
        }, {})
      );
      // colours disponibles a agregar
      this.colores.forEach((value, index, array) => {
        let color_added = coloresUsed.find((element) => element == value.catalogo_id)
        if (!color_added) {
          this.coloresDisponibes.push(value);
        }
      })
      let newItems = [];
      let newGroup = [];
      this.itemsVariantes.forEach((groupVariant) => {
        groupVariant.forEach(variant => {
          this.tallas.forEach(talla => {
            let item = variant
            if(variant.size_id !== talla.catalogo_id){
              item = {
                size_id: talla.catalogo_id,
                catalogo_size: talla.descripcion,
                store_product_id: variant.store_product_id,
                colour_id: variant.colour_id,
                catalogo_colour: variant.catalogo_colour,
                colour_data: variant.colour_data,
                indicador_stock: false,
                sale_price: null,
                from_db: false,
              }
            }
            newGroup.push(item);
          });
        })
        newItems.push(newGroup);
        newGroup = [];
      });
      this.itemsVariantes = newItems
      this.openModal(modal)
    })
  }

  agregarColor() {
    let new_item_ = {
      catalogo_colour: this.item.color_add.descripcion,
      colour_data: this.item.color_add.variable_2,
      colour_id: this.item.color_add.catalogo_id,
      store_product_id: this.itemProducto.tienda_producto_id || this.itemsVariantes[0][0].store_product_id
    }
    let new_color_ : any = []
    this.tallas.forEach(talla => {
      new_color_.push({...new_item_,
        size_id: talla.catalogo_id,
        catalogo_size: talla.descripcion,
        indicador_stock: false,
        sale_price: null,
        from_db: false,
      })
    });
    this.coloresDisponibes = this.coloresDisponibes.filter(function (value) {
      return value.catalogo_id !== this.item.color_add.catalogo_id;
    }.bind(this));
    this.itemsVariantes.push(new_color_)
    console.log(this.itemsVariantes)
    this.item.color_add = null;
  }

  varianteGrabar(modal: any) {
    let variantes = [];
    this.itemsVariantes.forEach((groupVariant) => {
      groupVariant.forEach(variant => {
        variant.indicador_stock = variant.indicador_stock ? 1 : 0;
        if((variant.indicador_stock && variant.stock) || variant.sale_price){
          variant.action = (variant.store_product_variant_id ? 'U' : 'I')
        } else {
          if(variant.store_product_variant_id){
            variant.action = 'D'
          }
        }
        if(variant.action){
          variantes.push(variant);
        }
      })
    })
    this.itemProducto.ref_store_product_variant = variantes;
    this.ohService.getOH().getUtil().confirm("¿Confirma grabar variantes del producto?", () => {
        this.destiendaProductoEditar(modal)
    })
  }
}
