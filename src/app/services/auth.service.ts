import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../modules/user.module';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Registra o serviço como singleton em toda a aplicação.
})
export class AuthService {
  // Propriedades da classe AuthService
  userLogged: User | null = null; // Armazena o usuário atualmente logado. É nulo quando não há usuário logado.
  loggedUser: string = ''; // Armazena o nome do usuário logado como uma string.
  url: string = `http://localhost:3000/users`; // URL base da API para acessar os dados dos usuários.
  userID = Number(this.userLogged?.id);

  // O HttpClient é injetado no construtor, permitindo fazer requisições HTTP.
  constructor(private http: HttpClient) {}

  // Método para verificar se um usuário está logado.
  public isUserLogged(): boolean {
    return this.userLogged !== null; // Retorna true se há um usuário logado, false caso contrário.
  }

  // Método para realizar o login de um usuário.
  public login(username: string, password: string): Observable<boolean> {
    // Define a URL para buscar o usuário com o nome e senha fornecidos.
    const url: string = `http://localhost:3000/users?username=${username}&password=${password}`;

    // Faz uma requisição GET para a URL especificada e retorna um Observable.
    return this.http.get<User[]>(url).pipe(
      map((resp: User[]) => {
        if (resp.length !== 0) {
          // Verifica se a resposta contém algum usuário.
          this.loggedUser = username; // Armazena o nome do usuário logado.
          console.log(this.loggedUser); // Loga o nome do usuário no console para depuração.
          this.userLogged = resp[0]; // Armazena os detalhes do usuário logado.
          this.userID = Number(this.userLogged.id);
          console.log('userID');
          return true; // Retorna true indicando que o login foi bem-sucedido.
        } else {
          return false; // Retorna false indicando falha no login.
        }
      })
    );
  }

  // Método para deslogar o usuário.
  public logout(): void {
    this.userLogged = null; // Reseta a variável do usuário logado para null.
    this.loggedUser = ''; // Limpa o nome do usuário logado.
  }

  // Método para verificar se um usuário já existe pelo nome.
  public checkUserExists(username: string): Observable<boolean> {
    // Define a URL para buscar o usuário pelo nome.
    const url: string = `http://localhost:3000/users?username=${username}`;

    // Faz uma requisição GET para verificar se o usuário existe.
    return this.http.get<User[]>(url).pipe(
      map((resp: User[]) => {
        if (resp.length !== 0) {
          return true; // Retorna true se o usuário existe.
        } else {
          return false; // Retorna false se o usuário não existe.
        }
      })
    );
  }

  // Método para registrar um novo usuário.
  public register(username: string, password: string): Observable<User> {
    // Cria um novo objeto de usuário com um array de likes vazio.
    const likes: number[] = [];
    const newUser: User = { username, password, likes };

    // Faz uma requisição POST para registrar o novo usuário.
    return this.http.post<User>(this.url, newUser);
  }

  // Método para atualizar os detalhes do usuário atualmente logado.
  public updateCurrentUser(user: User) {
    this.userLogged = user; // Atualiza a variável userLogged com os novos detalhes do usuário.
  }
}
