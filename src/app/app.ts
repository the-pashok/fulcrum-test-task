import { Component } from '@angular/core';

import { Library } from './library/library';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [Library],
})
export class App {}
