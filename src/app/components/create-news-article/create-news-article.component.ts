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
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { categories } from '../../models/constants'
import { statusList } from '../../models/constants'

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
    MatSelectModule,
    AngularEditorModule
  ],
  templateUrl: './create-news-article.component.html',
  styleUrl: './create-news-article.component.scss',
})
export class CreateNewsArticleComponent implements OnInit {

  editorConfig = {
    height: '150px',
    minHeight: '400px',
    editable: true,
    spellcheck: true,
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) =>{ },
    uploadWithCredentials: false,
    sanitize: true,
    //toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  }

  categories = categories;
  statuslist = statusList;

  form: FormGroup;
  selectedFiles: File[] = [];
  selectedImage: string | ArrayBuffer | null | any = null;
  selectedImages: string[] = [];
  isEdit = false;
  editArticleData: any;
  imageUrl: string = '';
  constructor(private fb: FormBuilder, private articleService: ArticleServiceService, private snackBar: MatSnackBar, private router: ActivatedRoute, private route: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      // header: ['', Validators.required],
      metaTags: [''],
      xEmbed: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      description: ['', Validators.required],
      publishedOn: [new Date(), Validators.required],
      status: ['', Validators.required],
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
          //header: article.data.header,
          metaTags: article.data.metaTags,
          xEmbed: article.data.xEmbed,
          country: article.data.country,
          state: article.data.state,
          description: article.data.description,
          publishedOn: new Date(article.data.publishedOn),
          status: article.data.isActive ? 'Yes' : 'No'
        });
        this.editArticleData = article.data;
        this.selectedImages = article.images || [];
          article.data.imageUrl.forEach((value: any) => {
          this.selectedImages.push(value)

        })
        this.convertImageUrlsToFiles(article.data.imageUrl)
      });
    }
  }
  editArticle() {
    const articleData = {
      ...this.form.value,
      publishedBy: 'admin',
      imageUrl: this.selectedFiles.length ? [] : this.form.value.imageUrl,
      id: this.editArticleData.id,
      shardId: this.editArticleData.shardId,
      numberOfViews: this.editArticleData.numberOfViews,
    };
    this.articleService.editArticleById(this.editArticleData.id, articleData).subscribe({
      next: (response) => {
        this.snackBar.open('Article updated successfully!', 'Close', { duration: 3000 });
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();
          this.selectedFiles.forEach(file => {
            formData.append('files', file);
          });
          this.articleService.uplodFilesToAirtcle(this.editArticleData.id, formData).subscribe({
            next: (response) => {
              this.snackBar.open('Article image uploaded successfully!', 'Close', { duration: 3000 });
            }
          })
        }
      }
    })
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const articleData = this.form.value;
    this.articleService.createArticle(articleData).subscribe({
      next: (response) => {
        this.snackBar.open('Article created successfully!', 'Close', { duration: 3000 });
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();
          this.selectedFiles.forEach(file => {
            formData.append('files', file);
          });
          console.log(response.data)
          this.articleService.uplodFilesToAirtcle(response.data.id, formData).subscribe({
            next: (response) => {
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

  home() {
    this.route.navigate(['/home']);
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  async convertImageUrlsToFiles(urls: string[]): Promise<File[]> {
    //const files: File[] = [];
    for (const url of urls) {
      const filename = url.split('/').pop() || 'image.jpg';
      const file = await this.urlToFile(url, filename, 'image/jpeg');
      this.selectedFiles.push(file);
    }
    return this.selectedFiles;
  }
}
