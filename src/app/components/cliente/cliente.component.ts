import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import  Swal  from 'sweetalert2';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
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
  frmCliente : FormGroup;
  constructor(
    private srvCliente : ClienteService,
    private fb : FormBuilder
  ) { 
      this.frmCliente = this.fb.group({
        id : [''],   //Esto lo colocamos cuando vamos a editar
        idCliente : [''],
        nombre : [''],
        apellido1 : [''],
        apellido2 : [''],
        telefono : [''],
        celular : [''],
        correo : [''],
        direccion : [''],
      //  fechaIngreso : ['']
      });
  }
  //Eventos Botones Principal
  onNuevo() {
    this.titulo = 'Nuevo cliente';
    this.frmCliente.reset(); //Poner esto después cuando se está editando
   // alert('Creando nuevo');
  }
  onEditar(id:number) {
    this.titulo = 'Editar cliente ' + id;
    this.srvCliente.buscar(id)
      .subscribe(
        data => { 
          console.log(data);
          delete data.fechaIngreso;  //esto es porque trae el campo de la bd
          this.frmCliente.setValue(data);
        }
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
  onGuardar2() {
    let llamado :Observable<any>;
    let texto : string;
    const datos = new Cliente(this.frmCliente.value);
    if (datos.id) {
      const id = datos.id;
      delete datos.id;
      delete datos.fechaIngreso;
      llamado = this.srvCliente.guardar(datos, id);
      texto = '¡Cambios guardados de forma correcta!';
      // alert('editando');
    } else {
       delete datos.id;
       llamado = this.srvCliente.guardar(datos)
       texto = '¡Creado de forma correcta!'
       //alert('creando nuevo')
    }
    llamado 
    .subscribe({
      complete: () => {
                        this.filtrar();
                        Swal.fire(texto, '', 'success') 
                      },
      error: (e) => {
        switch (e) {
            case 404 : {
              Swal.fire({
                title: 'Id Cliente no encontrado',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton:false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
                });
                break;              
            }
            case 409 : {
              Swal.fire({
                title: 'Id Cliente ya existe',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton:false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
                })
            }
        }
      }
    });
  }
  onGuardar() { //Esto completo después de hacer el formulario
    /*const datos = new Cliente({
      idCliente : '739367',
      nombre : 'María Luisa',
      apellido1: 'Cooper',
      apellido2: 'Suazo',
      telefono: '7779',
      celular: '9789899',
      direccion: 'Cieneguita y Olivia',
      correo: 'marilu@gmail.com'
    })
*/
    const datos = new Cliente(this.frmCliente.value);
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
