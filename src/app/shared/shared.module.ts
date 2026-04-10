import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiKitBuilderComponent } from './components/ai-kit-builder/ai-kit-builder.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AiKitBuilderComponent],
  exports: [AiKitBuilderComponent]
})
export class SharedModule {}
