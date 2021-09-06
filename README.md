# **Angular: Avançando com testes automatizados**

Curso da plataforma Alura

Instrutor: **Flavio Henrique de Souza Almeida**

## Como rodar
- Clone o projeto
- Rode o comando `npm run all` para rodar o servidor e a aplicação
- Rode o comando `npm run test` para rodar os testes

## Anotações
### Aula 1

- Criar o componente `photo-frame`
- Criar um estilo no componente
- Aplicar debounce no botão de like

```jsx
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-photo-frame',
  templateUrl: './photo-frame.component.html',
  styleUrls: ['./photo-frame.component.scss']
})
export class PhotoFrameComponent implements OnInit, OnDestroy {
  @Output() public liked: EventEmitter<void> = new EventEmitter();
  @Input() public description = '';
  @Input() public src = '';
  @Input() public likes = 0;
  private debounceSubject: Subject<void> = new Subject();
  private unsubscribe: Subject<void> = new Subject();

  public ngOnInit(): void {
    this.debounceSubject
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.liked.emit());
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public like(): void {
    this.debounceSubject.next();
  }
}
```

### Aula 2

- A função tick só funciona dentro do escopo da função fakeAsync.

```jsx
it(`#${PhotoFrameComponent.prototype.like.name}
    should trigger (@Output liked) once when called
    multiple times within debounce time`, fakeAsync(() => {
      fixture.detectChanges();
      let times = 0;
      component.liked.subscribe(() => times++);
      component.like();
      component.like();
      tick(500);
      expect(times).toBe(1);
  }));
```

- Testar o estado do DOM
- Instâncias de ComponentFixture<T> têm uma referência para a representação do template do componente no DOM permitindo que o desenvolvedor possa fazer pesquisas.

```jsx
it(`Should display number of likes when (@Input likes) is incremented`, () => {
    fixture.detectChanges();
    component.likes++;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('.like-counter');
    expect(element.textContent.trim()).toBe('1');
  });
```

- Testar o binding

```jsx
it(`(D) Should display image with src and description when bound to properties`, () => {
    const description = 'some description';
    const src = 'http://somesite.com/img.jpg';
    component.src = src;
    component.description = description;
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe(src);
    expect(img.getAttribute('alt')).toBe(description);
  });
});
```

### Aula 3

- Através de um elemento DOM, podemos chamar o método `dispatchEvent`. Este método recebe como parâmetro o tipo do evento que desejamos disparar.
- `@HostListener` → Permite que o componente ou diretiva escute a eventos nativos do seu elemento host.
- Converter para boolean

```tsx
!!this.event;
```

- Para testar diretiva é utilizado um componente fantoche. Sem ter a necessidade de testar cada componente no qual a diretiva foi utilizada.
- Outra abordagem
- `DebugElement` → Tem como referência o elemento nativo associado ao template do componente, inclusive possui uma forma exclusiva do Angular de procura de elementos.

```tsx
import { By } from '@angular/platform-browser';

const divEl = fixture.debugElement.query(By.directive(ActionDirective)).nativeElement;
```
