// deepEqual
// - function
// - object
// - array
// - Date/Map/Set
// - primitives

function deepEqual(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function') {
    return a === b;
  }
  if (typeof a !== 'object' || a === null || b === null) {
    return a === b;
  }
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.valueOf() === b.valueOf();
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }
    const iteratorA = a[Symbol.iterator]();
    const iteratorB = b[Symbol.iterator]();

    while (true) {
      let elemA = iteratorA.next(); // {done: boolean, value: any}
      let elemB = iteratorB.next();
      if (elemA.done) {
        break;
      }
      if (!deepEqual(elemA.value, elemB.value)) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }

    const iteratorA = a.entries(); // {done: true, value: ['key', 'value']}
    const iteratorB = b.entries();

    while (true) {
      const keyValueA = iteratorA.next();
      const keyValueB = iteratorB.next();
      if (keyValueA.done) {
        break;
      }
      if (!deepEqual(keyValueA.value, keyValueB.value)) {
        return false;
      }
    }
    return true;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}


function deepEqual2(value1, value2) {
  if (value1 === value2) {
    return true;
  }

  if (!isObject(value1) || !isObject(value2)) {
    return false;
  }

  if (value1.constructor !== value2.constructor) {
    return false;
  }

  if (instanceOf(value1, Date)) {
    return value1.getTime() === value2.getTime();
  }

  if (instanceOf(value1, Set) || instanceOf(value1, Map)) {
    if (value1.size !== value2.size) {
      return false;
    }

    const iterator1 = value1[Symbol.iterator]();
    const iterator2 = value2[Symbol.iterator]();

    while (true) {
      const result1 = iterator1.next();
      const result2 = iterator2.next();

      if (!deepEqual(result1.value, result2.value)) {
        return false;
      }

      if (result1.done) {
        break;
      }
    }

    return true;
  }

  if (Array.isArray(value1)) {
    if (value1.length !== value2.length) {
      return false;
    }

    for (let i = 0, l = value1.length; i < l; i++) {
      if (!deepEqual(value1[i], value2[i])) {
        return false;
      }
    }

    return true;
  }

  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0, l = keys1.length; i < l; i++) {
    if (!deepEqual2(value1[keys1[i]], value2[keys1[i]])) {
      return false;
    }
  }

  return true;
}

function instanceOf(value, constructor) {
  return value instanceof constructor;
}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

console.log(
  deepEqual2(
    { a: { b: { c: new Set([1, 2, [3]]), a: undefined } } },
    { a: { b: { c: new Set([1, 2, [3]]), b: 5 } } }
  )
);


console.log(
  deepEqual2(
    { a: { b: { c: [1, 2, [3]] } } },
    { a: { b: { c: [1, 2, [3] ] } } }
  )
);