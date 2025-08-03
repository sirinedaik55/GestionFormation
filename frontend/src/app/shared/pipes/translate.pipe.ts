import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription?: Subscription;
  private lastLanguage?: string;
  private lastKey?: string;
  private lastResult?: string;

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const currentLanguage = this.translationService.getCurrentLanguage();
    
    // Cache optimization: return cached result if key and language haven't changed
    if (this.lastKey === key && this.lastLanguage === currentLanguage && this.lastResult) {
      return this.lastResult;
    }

    // Update cache
    this.lastKey = key;
    this.lastLanguage = currentLanguage;
    this.lastResult = this.translationService.translate(key);
    
    return this.lastResult;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
