import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage
{
  constructor(private utilsService : UtilsService) { }

  public deleteCredit()
  {
    this.utilsService.showSweet({title:'¿Seguro que desea eliminar sus créditos?',
    showDenyButton: true, denyButtonText: 'No', denyButtonColor: '#FDF4EC',
    confirmButtonText: 'Sí', confirmButtonColor: '#30602E',
    customClass: {
      title: 'sweetTitle',
      confirmButton: 'sweetConfirm',
      denyButton: 'sweetDeny',
    }})
    .then((result)=>
    {
      if(result.isConfirmed)
      {
        console.log('Se elimino el credito')
      } 
    })  
  }
}
