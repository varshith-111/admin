// src/app/components/article-detail-dialog/article-detail-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newspaper-article',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article>
      <h1>{{ data.id }}</h1>
      <h1>{{ data.title }}</h1>
      <p class="date">{{ data.publishedOn }} by {{ data.publishedBy }}</p>
      <img *ngIf="data.imageUrl && data.imageUrl.length" [src]="data.imageUrl[0]" alt="Article Image" class="article-image"/>
      <h2>{{ data.header }}</h2>
      <p>{{ data.content }}</p>
      <p>{{ data.category }}</p>
      <p>{{ data.description }}</p>
      <button (click)="goBack()">Back</button>
    </article>
  `,
  styles: [`
    article {
      max-width: 800px;
      margin: 20px;
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
    }
    .date {
      font-size: 0.9em;
      color: gray;
    }
    .article-image {
      width: 50%;
      height: auto;
      margin: 10px 0;
    }
  `]
})
export class ArticleDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticleDetailDialogComponent>
  ) {
  }

  goBack() {
    this.dialogRef.close();
  }
}