import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG modules
import { DropdownModule } from 'primeng/dropdown';

// Components and pipes
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    LanguageSelectorComponent,
    TranslatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  exports: [
    LanguageSelectorComponent,
    TranslatePipe
  ]
})
export class SharedModule { }
