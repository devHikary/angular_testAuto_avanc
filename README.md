# **Angular: Avançando com testes automatizados**

Curso da plataforma Alura

Instrutor: **Flavio Henrique de Souza Almeida**

Continuação do curso de fundamentos, serão apresentados novos recursos, como teste de diretiva, como trabalhar e testar Node Changes, trabalhar com HTTP Client teste em model, mock providers etc.

## 🛠️ Abrir e rodar o projeto
- Clone o projeto
- Rode o comando `npm run all` para rodar o servidor e a aplicação
- Rode o comando `npm run test` para rodar os testes

## ✔️ Técnicas e tecnologias utilizadas
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
### Aula 4

- `ngOnChanges()` → O método é chamado imediatamente quando é detectado uma alteração nas propriedades vinculadas ao dado

[Angular](https://angular.io/api/core/OnChanges)

```tsx
@Component({selector: 'my-cmp', template: `...`})
class MyComponent implements OnChanges {
  @Input() prop: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }
}
```

- única maneira do ngOnChanges funcionar e ser chamado é se a propriedade do seu componente está sendo referenciada através de um template.

```tsx
fixture.detectChanges();
    const change: SimpleChanges = {
      // Tem sempre o nome da input property que mudou
      photos: new SimpleChange([], component.photos, true)
    };
    component.ngOnChanges(change);
```

### Aula 5

- É através de TestBed.inject que injetamos um serviço em nosso teste.
- A função `spyOn` recebe como primeiro parâmetro um objeto e como segundo uma **string** que contém exatamente o nome do método que queremos espionar. Em seguida, encadeando uma chamada há `.and.returnValue,` podemos passar para **returnValue** o valor que o método retornará quando for chamado.
- `.and.returnValue(of(photos))` → O `spyOn` vai escutar o `getPhotos`, toda vez que esse método for chamado dentro desse meu it, ele vai no lugar de executar o comportamento original, que é ir no **backend**, ele vai me retornar um **observable** com uma lista de fotos, porque isso é parte da API do meu serviço.

```tsx
it(`(D) Should display board when data arrives`, () => {
    fixture.detectChanges();
    const photos = buildPhotoList();
    spyOn(service, 'getPhotos')
      .and.returnValue(of(photos));
  });
```

- Quando utilizado no lugar do `HttpClientModule`, irá fornecer uma instância especial de **HttpClient** que pode ser controlada em nossos testes.
- Assim como qualquer serviço, pode ser injetado através de `TestBed.inject,` porém é necessário que o módulo `HttpClientTestingModule` tenha sido importado pelo módulo do teste.
- Quando é aplicado lógicas de transformação diretamente nas chamadas de instâncias de HttpClient. Esse é um dos motivos que levam o desenvolvedor a utilizar o HttpClientTestingController do módulo HttpClientTestingModule para criar respostas falsas para determinadas APIs. Ele pode fornecer dados previsíveis tornando possível o teste dessas transformações.
- `httpController.verify()`, verifica se tem alguma requisição feita, que no seu teste executou, que não tenha uma resposta, que você não tenha um match no expectOne. Isso é importante porque você é obrigado a dar uma resposta para todas elas.
- **Mock provider with useClass** → utilizado quando queremos sobrescrever apenas apenas um método e poder reutilizá-lo.
