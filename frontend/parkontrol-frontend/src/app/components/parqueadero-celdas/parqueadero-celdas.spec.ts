import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueaderoCeldas } from './parqueadero-celdas';

describe('ParqueaderoCeldas', () => {
  let component: ParqueaderoCeldas;
  let fixture: ComponentFixture<ParqueaderoCeldas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParqueaderoCeldas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParqueaderoCeldas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
