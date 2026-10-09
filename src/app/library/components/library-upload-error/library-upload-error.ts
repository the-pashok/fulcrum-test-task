import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-library-upload-error',
  styleUrl: './library-upload-error.scss',
  templateUrl: './library-upload-error.html',
})
export class LibraryUploadError {
  // Output event to hide an error content
  public readonly dismissError: OutputEmitterRef<void> = output<void>();

  public readonly errorText: InputSignal<string | null> = input<string | null>(null);
}
