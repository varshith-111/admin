import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ArticleDetailDialogComponent } from '../article-detail-dialog/article-detail-dialog.component';
import { finalize } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
  ],
  template: `
    <div class="article-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Article Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group #tabGroup>
            <mat-tab label="All Articles">
              <h2>Articles List</h2>
              <div *ngFor="let article of articles">
                <h3>{{ article.title }}</h3>
                <button mat-button (click)="editArticle(article.id, tabGroup)">Edit</button>
                <button mat-button (click)="deleteArticle(article.id)">Delete</button>
                <button mat-button (click)="viewArticle(article)">view</button>
              </div>
            </mat-tab>
            <mat-tab label="Create Article">
              <br>
              <form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
                <mat-form-field appearance="outline">
                  <mat-label>Title</mat-label>
                  <input matInput formControlName="title" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Category</mat-label>
                  <mat-select formControlName="category" required>
                    <mat-option *ngFor="let category of categories" [value]="category">{{ category }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Header</mat-label>
                  <input matInput formControlName="header" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Meta Tags</mat-label>
                  <input matInput formControlName="metaTags" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>X Embed</mat-label>
                  <input matInput formControlName="xEmbed">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Country</mat-label>
                  <input matInput formControlName="country" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>State</mat-label>
                  <input matInput formControlName="state" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="4" required></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Published On</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="publishedOn">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>

                <div class="file-upload">
                  <input type="file" multiple (change)="onFileSelect($event)" #fileInput>
                </div>

                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="articleForm.invalid || loading">
                  {{ loading ? 'Creating...' : 'Create Article' }}
                </button>
              </form>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .article-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .file-upload {
      margin: 16px 0;
    }
  `]
})
export class CreateArticleComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  articleForm: FormGroup;
  loading = false;
  selectedFiles: File[] = [];
  articleId: string | null = null;
  articles: any[] = [];

  categories = [
    'ALL', 'Politics', 'Art', 'Food', 'Fashion', 'Technology',
    'Science', 'Health', 'Travel', 'Business', 'Entertainment',
    'Education', 'Environment', 'Sports', 'Literature'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      header: ['', Validators.required],
      metaTags: ['', Validators.required],
      xEmbed: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      description: ['', Validators.required],
      publishedOn: [new Date(), Validators.required],
    });

    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.loadArticle(this.articleId);
    }

    this.loadAllArticles();
  }

  loadAllArticles() {
    this.http.get('https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Articles/GetAll').subscribe({
      next: (response: any) => {
        this.articles = response.data;
      },
      error: (error) => {
        this.snackBar.open('Failed to load articles: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  loadArticle(id: string) {
    this.http.get(`https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Articles/GetbyId/${id}`).subscribe({
      next: (response: any) => {
        this.articleForm.patchValue(response.data);
      },
      error: (error) => {
        this.snackBar.open('Failed to load article: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  editArticle(id: string, tabGroup: MatTabGroup) {
    this.articleId = id;
    this.loadArticle(id);
    tabGroup.selectedIndex = 1;
  }

  deleteArticle(id: string) {
    const token = localStorage.getItem('token');
    this.http.get(`https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Admin/deleteById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.snackBar.open('Article deleted successfully', 'Close', {
          duration: 3000
        });
        this.loadAllArticles();
      },
      error: (error) => {
        this.snackBar.open('Failed to delete article: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    const publishedOnValue = this.articleForm.value.publishedOn;

    // Convert the publishedOnValue to a Date object if it's a string
    let publishedOnDate: Date | null = null;
    if (typeof publishedOnValue === 'string') {
        publishedOnDate = new Date(publishedOnValue);
    } else if (publishedOnValue instanceof Date) {
        publishedOnDate = publishedOnValue;
    }

    // Check if publishedOnDate is a valid Date
    if (publishedOnDate && !isNaN(publishedOnDate.getTime())) {
        const publishedOnISO = publishedOnDate.toISOString();
        this.loading = true;
        const articleData = {
          ...this.articleForm.value,
          publishedBy: 'admin',
          imageUrl: this.selectedFiles.length ? [] : this.articleForm.value.imageUrl,
          publishedOn: publishedOnISO
        };

        if(this.articleId) {
           articleData.id = this.articleId;
        }
        const token = localStorage.getItem('token');
        const apiUrl = this.articleId 
          ? `https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Admin/updateById/${this.articleId}`
          : 'https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Admin/createaarticle';

        this.http.post(apiUrl, articleData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).pipe(
            finalize(() => {
                this.loading = false;
            })
        ).subscribe({
          next: (response: any) => {
            if (this.selectedFiles.length > 0) {
              const formData = new FormData();
              this.selectedFiles.forEach(file => {
                formData.append('files', file);
              });

              const id = this.articleId ?? response.data.id;

              this.http.post(`https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Admin/uploadFiles/${id}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).pipe(
                  finalize(() => {
                      this.loading = false;
                  })
              ).subscribe({
                next: () => {
                  this.snackBar.open('Article created successfully', 'Close', {
                    duration: 3000
                  });
                  this.loadAllArticles();
                  this.resetForm();
                },
                error: (error) => {
                  this.snackBar.open('File upload failed: ' + error.message, 'Close', {
                    duration: 3000
                  });
                }
              });
            } else {
              this.snackBar.open('Article created successfully', 'Close', {
                duration: 3000
              });
              this.resetForm();
              this.loadAllArticles();
            }
          },
          error: (error) => {
            this.snackBar.open('Article creation failed: ' + error.message, 'Close', {
              duration: 3000
            });
          }
        });
    } else {
        console.error('Invalid date for publishedOn:', publishedOnValue);
        // Handle the error accordingly (e.g., show a message to the user)
    }
  }

  resetForm() {
    this.articleForm.reset({
      title: '',
      category: '',
      header: '',
      metaTags: '',
      xEmbed: '',
      country: '',
      state: '',
      description: '',
      publishedOn: new Date(),
    });
    this.selectedFiles = [];
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  viewArticle(article: any) {
    this.dialog.open(ArticleDetailDialogComponent, {
      data: article,
      width: '80%',
      height: '80%'
    });
  }
}
