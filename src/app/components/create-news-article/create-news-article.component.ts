import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ArticleServiceService } from '../../services/article-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-news-article',
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
    MatSelectModule
  ],
  templateUrl: './create-news-article.component.html',
  styleUrl: './create-news-article.component.scss',
})
export class CreateNewsArticleComponent implements OnInit {
  form: FormGroup;
  selectedFiles: File[] = [];
  selectedImage: string | ArrayBuffer | null | any = null;
  selectedImages: string[] = [];
  isEdit = false;
  imageUrl : string = '';
  constructor(private fb: FormBuilder, private articleService: ArticleServiceService, private snackBar: MatSnackBar,private router: ActivatedRoute, private route : Router ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      header: ['', Validators.required],
      metaTags: ['', Validators.required],
      xEmbed: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      description: ['', Validators.required],
      publishedOn: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    let articleId 
    this.router.paramMap.subscribe(params => {
      articleId = params.get('id'); 
    });
    if (articleId) {
      this.isEdit = true;
      this.articleService.getArticleById(articleId).subscribe(article => {
        this.form.patchValue({
          title: article.data.title,
          category: article.data.category,
          header: article.data.header,
          metaTags: article.data.metaTags,
          xEmbed: article.data.xEmbed,
          country: article.data.country,
          state: article.data.state,
          description: article.data.description,
          publishedOn: new Date(article.publishedOn)
        });
        this.selectedImages = article.images || [];
        this.imageUrl = article.data.imageUrl
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const articleData = this.form.value;
    this.articleService.createArticle(articleData).subscribe({
      next: (response) => {
        this.snackBar.open('Article created successfully!', 'Close', { duration: 3000 });
        console.log(response.data)
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();
          this.selectedFiles.forEach(file => {
            formData.append('files', file);
          });

          this.articleService.uplodFilesToAirtcle(response.data.id, formData).subscribe({
            next: (response) =>{
              this.snackBar.open('Article image uploaded successfully!', 'Close', { duration: 3000 });
            }
          })
        }
        this.form.reset(); 
      },
      error: (error) => {
        this.snackBar.open('Failed to create article. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
     const input = event.target as HTMLInputElement;

    if (input.files) {
      this.selectedImages = []; 
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.selectedImages.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  home(){
    this.route.navigate(['/home']);
  }
}
