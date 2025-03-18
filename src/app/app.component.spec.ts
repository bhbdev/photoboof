import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let elem: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    elem = fixture.nativeElement as HTMLElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'photoboof' title`, () => {
    expect(app.title).toEqual('photoboof');
  });

  it('should render title', () => {
    expect(elem.querySelector('h1')?.textContent).toContain('Photo Boof');
  });
  
  it('should render app-booth', () => {
    expect(elem.querySelector('app-booth')).toBeTruthy();
  });

  // should render a footer with a p element with a element with an ng-icon element
  it('should render footer', () => {
    expect(elem.querySelector('footer p a ng-icon')).toBeTruthy();
  });

});
