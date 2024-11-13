import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsArticleComponent } from './create-news-article.component';

describe('CreateNewsArticleComponent', () => {
  let component: CreateNewsArticleComponent;
  let fixture: ComponentFixture<CreateNewsArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewsArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewsArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
