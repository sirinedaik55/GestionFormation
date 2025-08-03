import { Component, OnInit } from '@angular/core';
import { TranslationService, Language } from '../../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  template: `
    <div class="language-selector">
      <div class="language-toggle" (click)="toggleLanguage()">
        <div class="flag-container">
          <img [src]="getFlagUrl(selectedLanguage)" [alt]="selectedLanguage" class="flag-image">
        </div>
        <span class="language-code">{{ getLanguageLabel(selectedLanguage) }}</span>
        <i class="pi pi-chevron-down toggle-icon"></i>
      </div>

      <!-- Alternative: Simple toggle buttons -->
      <div class="language-buttons" *ngIf="false">
        <button
          *ngFor="let lang of languages"
          class="language-btn"
          [class.active]="selectedLanguage === lang.value"
          (click)="setLanguage(lang.value)">
          <img [src]="getFlagUrl(lang.value)" [alt]="lang.value" class="flag-btn">
          {{ getLanguageLabel(lang.value) }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      display: inline-block;
      position: relative;
    }

    .language-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      min-width: 80px;
    }

    .language-toggle:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .flag-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .flag-image {
      width: 18px;
      height: 18px;
      object-fit: cover;
      border-radius: 50%;
    }

    .language-code {
      font-size: 12px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toggle-icon {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
      transition: transform 0.3s ease;
    }

    .language-toggle:hover .toggle-icon {
      transform: rotate(180deg);
    }

    /* Alternative button style */
    .language-buttons {
      display: flex;
      gap: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 4px;
      backdrop-filter: blur(10px);
    }

    .language-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border: none;
      background: transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
    }

    .language-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .language-btn.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 600;
    }

    .flag-btn {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* Dark theme adjustments */
    :host-context(.dark) .language-toggle {
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .language-toggle:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  selectedLanguage: Language = 'en';

  languages = [
    { label: 'English', value: 'en' as Language },
    { label: 'Français', value: 'fr' as Language }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }

  toggleLanguage() {
    // Toggle between en and fr
    const newLanguage: Language = this.selectedLanguage === 'en' ? 'fr' : 'en';
    this.setLanguage(newLanguage);
  }

  setLanguage(language: Language) {
    this.translationService.setLanguage(language);
    this.selectedLanguage = language;
  }

  onLanguageChange(event: any) {
    const newLanguage = event.value as Language;
    this.setLanguage(newLanguage);
  }

  getFlagUrl(language: Language): string {
    const flags = {
      'en': 'assets/flags/us.svg',
      'fr': 'assets/flags/fr.svg'
    };
    return flags[language] || flags['en'];
  }

  getLanguageLabel(language: Language): string {
    const labels = {
      'en': 'EN',
      'fr': 'FR'
    };
    return labels[language] || 'EN';
  }
}
