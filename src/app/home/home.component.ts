import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DogsService } from '../services/Dogs.service';
import { AllDogs } from '../modules/allDogs.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../modules/user.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  dogs: AllDogs[] = []; // Lista de cães
  user: User | null = null; // Usuário logado (ou null se não logado)
  searchInput: string = ''; // Texto da busca
  page: number = 1; // Página atual para a busca
  results: number = 4; // Número de resultados por página
  showMoreBtn: boolean = true; // Mostrar botão "Show more"
  inputValue: string = ''; // Valor da busca armazenado
  showMoreSearchResults: boolean = false; // Mostrar botão "Show more" para resultados de busca
  scrollTop: boolean = false;

  constructor(
    private dogsService: DogsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.userLogged;
  }

  ngOnInit() {
    this.getDogs(); // Carrega os cães ao iniciar
  }

  // Método para obter todos os cães
  getDogs(): void {
    this.dogsService.getAllDogs(this.page, this.results).subscribe({
      next: (data) => (this.dogs = data), // Atualiza a lista de cães
      error: (error) => console.error('Error fetching dogs:', error),
    });
  }

  // Método logout
  logout(): void {
    this.authService.logout(); // Chama o serviço de logout
    this.router.navigate(['']); // Redireciona para a página inicial
  }

  // Método procura
  search(): void {
    this.results = 4; // Reinicia o número de resultados para a busca
    this.showMoreBtn = false; // Esconde o botão "Show more" da lista completa de cães

    if (this.searchInput.trim()) {
      // Verifica se o campo de busca não está vazio ou apenas com espaços em branco
      // Faz uma requisição ao serviço de cães para buscar cães que correspondem ao termo de busca
      this.dogsService
        .getDogsBySearch(this.searchInput, this.results)
        .subscribe({
          next: (d) => {
            // Função executada quando a resposta é recebida com sucesso
            this.dogs = d; // Atualiza a lista de cães com os resultados da busca
            console.log('Search results:', this.dogs); // Loga os resultados da busca no console

            // Verifica se o número de resultados é menor que o limite (neste caso, 4)
            if (d.length === 0 || d.length < 4) {
              this.showMoreSearchResults = false; // Esconde o botão "Show more" para busca se não houver mais resultados
            } else {
              this.showMoreSearchResults = true; // Mostra o botão "Show more" para buscar mais resultados
            }
          },
          error: (error) => console.log('Error searching for dogs', error), // Função executada em caso de erro na requisição, loga o erro no console
        });

      this.inputValue = this.searchInput; // Armazena o valor da busca atual em uma variável separada
      this.searchInput = ''; // Limpa o campo de busca
    } else {
      this.showMoreBtn = true; // Se o campo de busca estiver vazio, mostra o botão "Show more" para a lista completa de cães
      console.log('Search input is empty, fetching all dogs.');
      this.getDogs(); // Recarrega a lista completa de cães
    }
  }

  showMore() {
    let plus = 4;
    this.results += plus;
    this.dogsService.getAllDogs(this.page, this.results).subscribe({
      next: (data) => {
        this.dogs = data;
        this.scrollToBottom();
      },
      error: (error) => console.error('Error fetching dogs:', error),
    });
    if (this.results >= 172) {
      this.showMoreBtn = false;
    }
  }

  showMoreSearch(): void {
    this.results += 4;
    this.dogsService.getDogsBySearch(this.inputValue, this.results).subscribe({
      next: (d) => {
        this.dogs = d;
        if (this.results != d.length) {
          this.showMoreSearchResults = false; // retira botão caso o dogs.length for diferente do limite que estamos a passar
        }
        this.scrollToBottom();
      },
      error: (error) => console.log('Error searching for dogs', error),
    });
  }

  scrollToBottom(): void {
    const div = document.querySelector('.dogContainer');

    if (div) {
      console.log(div);
      div.scrollTop = div.scrollHeight;
      this.scrollTop = true;
    }
  }

  scrollToTop(): void {
    const div = document.querySelector('.dogContainer');

    if (div) {
      console.log(div);
      div.scrollTop = 0;
      this.scrollTop = false;
    }
  }

  favorites(): void {
    this.router.navigate(['/favorites']);
  }
}
