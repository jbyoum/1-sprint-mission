class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
      return;
    }
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  insertAfter(targetValue, newValue) {
    let current = this.head;
    while (current) {
      if (current.value === targetValue) {
        const newNode = new Node(newValue);
        newNode.prev = current;
        newNode.next = current.next;
        if (current.next) {
          current.next.prev = newNode;
        } else {
          this.tail = newNode;
        }
        current.next = newNode;
        return;
      }
      current = current.next;
    }
    console.log(`${targetValue}를 찾을 수 없습니다.`);
  }

  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  removeNode(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) {
      console.log(`${value}를 찾을 수 없습니다.`);
      return;
    }
    if (targetNode.prev) {
      targetNode.prev.next = targetNode.next;
    } else {
      this.head = targetNode.next;
    }
    if (targetNode.next) {
      targetNode.next.prev = targetNode.prev;
    } else {
      this.tail = targetNode.prev;
    }
  }
}

export default DoublyLinkedList;
