@Component(
  selector: 'app-example'
)
export class ExampleComponent {
  
  // ...

  data$: Observable<T>;
    
  ctrl = new DataReformer<T>(o => o.id);

  getDataFromServer(): void {
    this.data$ = of([1,2,3,4,5,6,7,8]).pipe(
      dataReformer(this.ctrl)
    );  
  }
    
  addItem(i: T): void {
    this.ctrl.add(i);
  }
    
  removeItem(i: T): void {
    this.ctrl.remove(i);
  }

}
