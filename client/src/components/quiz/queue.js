//a-> prev: b, next: null
//b -> prev: c, next: a
// c -> prev: null, next: b

//this.first -> a
//this.last -> b

export default class Queue {

  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  enqueue(value) {

    const node = {
      value,
      next: null,
      prev: null
    }

    if (this.last) {
      this.last.prev = node;
      node.next = this.last;
    }

    this.last = node;

    if (this.first === null) {
      this.first = node;
    }

    this.length++;
  }

  dequeue() {

    if (this.first === null && this.last === null) {
      return null;
    }

    const val = this.first.value;

    if (this.first.value === this.last.value) {
      this.first = this.first.next;
      this.last = this.last.prev;
    }

    else {
      this.first = this.first.prev;
      this.first.next = null;
    }

    this.length--;
    return val;
  }

}