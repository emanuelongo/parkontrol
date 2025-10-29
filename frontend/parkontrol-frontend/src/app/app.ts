import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { TarifaModalComponent } from './components/tarifa-modal/tarifa-modal';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, TarifaModalComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('parkontrol-frontend');
}
