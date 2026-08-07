import { FloatingChat } from './shared/chat/components/floating-chat/floating-chat';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FloatingChat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'MathCityAdmin';
  private readonly themeService = inject(ThemeService);
}
