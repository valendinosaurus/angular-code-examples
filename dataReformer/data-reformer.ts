import { merge, MonoTypeOperatorFunction, Observable, Subject, tap } from 'rxjs';

export class DataReformerCtrl<T> {

  private store: T[] = [];
  private reform$ = new Subject<T[]>();

  constructor(
    private propertyAccessor: (e: T) => any
  ) {
  }

  push(...data: T[]): void {
    this.replaceItems(...data);
    this.addItems(...data);
    this.notify();
  }

  remove(...data: T[]): void {
    this.removeItems(...data);
    this.notify();
  }

  static dataReformer<T extends any[]>(dataReformerCtrl: DataReformerCtrl<T[number]>): MonoTypeOperatorFunction<T> {
    return dataReformerCtrl.operator$ as MonoTypeOperatorFunction<T>;
  }

  private operator$: MonoTypeOperatorFunction<T[]> = (source$: Observable<T[]>) => {
    source$ = source$.pipe(
      tap(store => this.store = store),
    );
    return merge(source$, this.reform$);
  };

  private replaceItems(...data: T[]): void {
    // go trough the store and replace objects with same comparer property
    this.store = this.store.map(obj =>
      data.find(o => this.propertyAccessor(o) === this.propertyAccessor(obj)) || obj
    );
  }

  private addItems(...data: T[]): void {
    // add new objects where not already exists in the store
    this.store = [
      ...this.store,
      ...data.filter(e =>
        !this.store.find(f => this.propertyAccessor(e) === this.propertyAccessor(f))
      )
    ];
  }

  private removeItems(...data: T[]): void {
    // find objects in the store with same comparer property and remove it
    this.store = this.store.filter(e =>
      !data.find(f => this.propertyAccessor(e) === this.propertyAccessor(f))
    );
  }

  private notify(): void {
    this.reform$.next(this.store);
  }
}

export const dataReformer = DataReformerCtrl.dataReformer;
