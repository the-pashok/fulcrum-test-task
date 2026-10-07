import { Component } from '@angular/core';

import { LibraryPage } from './library/library-page';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [LibraryPage],
})
export class App {}
