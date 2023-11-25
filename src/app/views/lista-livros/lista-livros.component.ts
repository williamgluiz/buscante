import { FormControl } from '@angular/forms';
import { Item, LivrosResultado } from './../../models/interfaces';
import { Component } from '@angular/core';
import {  EMPTY, catchError, debounceTime, filter, map, of, switchMap, throwError } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livro-volume-info';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      map(resultado => resultado.items ?? []),
      map(items => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        console.log(erro)
        return throwError(()=> new Error(this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação.'))
      })
  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
     })
  }
}

function tap(arg0: () => void): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

