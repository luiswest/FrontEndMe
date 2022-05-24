import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import  Swal  from 'sweetalert2';
import { Cliente } from 'src/app/shared/models/cliente.model';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  titulo : string = '';
  filtro : any;
  clientes : any = [new Cliente()];
  cliente = new Cliente();
  constructor(
    private srvCliente : ClienteService
  ) { }
  //Eventos Botones Principal
  onNuevo() {
    this.titulo = 'Nuevo cliente';
   // alert('Creando nuevo');
  }
  onEditar(id:number) {
    this.titulo = 'Editar cliente ' + id;
    this.srvCliente.buscar(id)
      .subscribe(
        data => { console.log(data); }
      );    
    //alert('Editarndo');
  }
  onEliminar(id:number, nombre:string) {
    Swal.fire({
      title: '¿Seguro de eliminar el Cliente?',
      text: nombre,
      icon: 'question',
    //  toast: true,
    //  showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    //  denyButtonText: 'No guardar',   //<-- al cancelar sin guardar cambios Editar y Nuevo
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {          
        this.srvCliente.eliminar(id)
          .subscribe({
            complete: () => {
              Swal.fire('¡Eliminado!', '', 'success');
              this.filtrar();
            },
            error: (err) => {
              switch (err) {
                  case 412 : 
                      Swal.fire({
                        title: 'No se puede eliminar',
                        text: 'El cliente tiene artefacto relacionado',
                        icon: 'info',
                      //  showDenyButton: true,
                        showCancelButton: true,
                        showConfirmButton:false,
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'Cerrar'
                        });
                      break;
                case 404 :
                    Swal.fire({
                      title: 'El cliente no existe',
                      icon: 'info',
                    //  showDenyButton: true,
                      showCancelButton: true,
                      showConfirmButton:false,
                      cancelButtonColor: '#d33',
                      cancelButtonText: 'Cerrar'
                      });                  
                      break;
                  // Swal.fire('No se puede eliminar', 'Tiene artefacto relacionado', 'info')
              }
            }
          })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
    //alert('Eliminando');
  }
  onFiltrar() {
    alert('Filtrando');
  }
  onImprimir() {
    alert('Imprimiendo');
  }
  onCerrar() {
    alert('Cerrando');
  }
  //Eventos botónes secundarios
  onGuardar() { //Esto completo después de hacer el formulario
    const datos = new Cliente({
      idCliente : '739367',
      nombre : 'María Luisa',
      apellido1: 'Cooper',
      apellido2: 'Suazo',
      telefono: '7779',
      celular: '9789899',
      direccion: 'Cieneguita y Olivia',
      correo: 'marilu@gmail.com'
    })
    this.srvCliente.guardar(datos)
      .subscribe({
        complete: () => {
                          this.filtrar();
                          Swal.fire('¡Creado de forma correcta!', '', 'success') 
                        },
        error: (e) => {
          switch (e) {
              case 409 : {
                Swal.fire({
                  title: 'Id Cliente ya existe',
                  icon: 'error',
                //  showDenyButton: true,
                  showCancelButton: true,
                  showConfirmButton:false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                  })
              }
          }
        }
      })
   
  }
  filtrar() {
    this.srvCliente.filtrar(this.filtro, 1, 10)
      .subscribe(
        data => {
          console.log(data);
          this.clientes = data;
          console.log(this.clientes);
        }
      );
  }
  eliminar() {
  }
  ngOnInit(): void {
    this.filtro = {id:'',nombre:'', apellido1:'', apellido2:''};
    this.filtrar();    
  }
}
