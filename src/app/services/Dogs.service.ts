import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { AllDogs } from '../modules/allDogs.model';
import { User } from '../modules/user.module';

type AddToFavoritePayload = {
  likes: number[];
};

@Injectable({
  providedIn: 'root',
})
export class DogsService {
  // Define a URL base para a API de cães.
  private url = 'http://localhost:3000/dogs';

  // O HttpClient é injetado no construtor para permitir a realização de requisições HTTP.
  constructor(private http: HttpClient) {}

  // Método para buscar todos os cães, com paginação e limite de resultados.
  getAllDogs(page: number, results: number): Observable<AllDogs[]> {
    // Constrói a URL com parâmetros de paginação.
    let homeUrl = `${this.url}?_page=${page}&_limit=${results}`;
    return this.http.get<AllDogs[]>(homeUrl); // Retorna um Observable que emite a lista de cães.
  }

  // Método para buscar um cão específico pelo ID.
  getDogById(id: number): Observable<AllDogs> {
    // Constrói a URL com o ID do cão.
    const dogUrl = `${this.url}/${id}`;
    return this.http.get<AllDogs>(dogUrl); // Retorna um Observable que emite os dados do cão.
  }

  // Método para buscar múltiplos cães por seus IDs.
  getAllDogsByIds(dogIds: number[]): Observable<AllDogs[]> {
    // Cria um array de Observables, um para cada ID de cão.
    const dogRequests: Observable<AllDogs>[] = dogIds.map((id) =>
      this.getDogById(id)
    );
    console.log('dogRequests = ', dogRequests);

    // Usa forkJoin para aguardar todas as requisições HTTP serem completadas.
    return forkJoin(dogRequests); // Retorna um Observable que emite um array dos dados dos cães.
  }

  // Método para buscar cães pelo nome, com limite de resultados.
  getDogsBySearch(search: string, results: number): Observable<AllDogs[]> {
    console.log('input = ', search);
    // Constrói a URL para busca com o nome e limite de resultados.
    const searchUrl: string = `${this.url}?name_like=${search}&_page=1&_limit=${results}`;
    console.log('url= ', searchUrl);
    return this.http.get<AllDogs[]>(searchUrl); // Retorna um Observable que emite a lista de cães correspondentes à busca.
  }

  // Método para verificar se o usuário deu like em um cão específico.
  checkDogLike(userId: number, dogId: number): Observable<boolean> {
    // Constrói a URL para buscar o usuário pelo ID.
    let url: string = `http://localhost:3000/users/${userId}`;
    return this.http
      .get<User>(url)
      .pipe(map((user) => user.likes.includes(dogId))); // Retorna um Observable que emite true se o usuário deu like no cão, false caso contrário.
  }

  // Método para adicionar um like em um cão para um usuário.
  addLike(userId: number, dogId: number): Observable<User> {
    // Define a URL para buscar o usuário pelo ID.
    let url: string = `http://localhost:3000/users/${userId}`;
    console.log('addLike service');

    return this.http.get<User>(url).pipe(
      map((user) => {
        // Atualiza a lista de likes do usuário, garantindo que o ID do cão não esteja duplicado.
        const updatedLikes = user.likes.includes(dogId)
          ? // verificamos com o operador ternario se ja tem like naquele cão
            user.likes
          : [...user.likes, dogId]; // aqui criamos um array novo e acrescentamos o dog id
        console.log('updatedLikes: ', updatedLikes);
        return {
          // retorna um user com as mesmas caracteristicas do original
          ...user,
          likes: updatedLikes, //dou update aos likes
        }; // Retorna o usuário com a lista de likes atualizada.
      }),
      switchMap((updatedUser) => {
        const body: AddToFavoritePayload = { likes: updatedUser.likes };
        console.log('body: ', body);
        // Faz uma requisição PATCH para atualizar o usuário no servidor com a nova lista de likes.
        return this.http.patch<User>(url, body);
      })
    );
  }

  // Método para remover um like de um cão para um usuário.
  removeLike(userId: number, dogId: number): Observable<User> {
    // Define a URL para buscar o usuário pelo ID.
    let url: string = `http://localhost:3000/users/${userId}`;

    return this.http.get<User>(url).pipe(
      map((user) => {
        // Atualiza a lista de likes do usuário, removendo o ID do cão.
        const updatedLikes = !user.likes.includes(dogId)
          ? user.likes
          : user.likes.filter((like) => like !== dogId);
        return {
          ...user,
          likes: updatedLikes,
        }; // Retorna o usuário com a lista de likes atualizada.
      }),
      switchMap((updatedUser) => {
        const body: AddToFavoritePayload = { likes: updatedUser.likes };
        // Faz uma requisição PATCH para atualizar o usuário no servidor com a nova lista de likes.
        return this.http.patch<User>(url, body);
      })
    );
  }
}
