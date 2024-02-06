class Deferred {
    constructor(cb) {
      this.state = 'pending';
      this.callbacks = [];
      this.resolve = this.resolve.bind(this);
      cb(this.resolve);
    }
  
    then(cb) {
      if (this.state === 'pending') {
        this.callbacks.push(cb);
      }
      if (this.state === 'fulfilled') {
        cb();
      }
      return this;
    }
  
    resolve(value) {
      /*let currentResult = value;
      for (let i = 0; i < this.callbacks.length; i++) {
        let currentCallback = this.callbacks[i];
        currentResult = currentCallback(currentResult);
      } */
      this.state = 'fulfilled';
      let currentResult = value;
      let currentIndex = 0;
  
      /* 
      for (let i = 0, l = this.callbacks.length; i < l; i++) {
        const cb = this.callbacks[i];
        const result = cb(currentResult);
        if (result instanceof Deferred) {
          for (let j = i + 1; j < l; j++) {
            result.then(this.callbacks[j]);
          }
          break;
        } else {
          currentResult = result;
        }
      } */
  
      const handler = () => 
        if (currentIndex >= this.callbacks.length) {
          return;
        }
        let currentCallback = this.callbacks[currentIndex];
        currentIndex++;
        currentResult = currentCallback(currentResult);
        if (currentResult instanceof Deferred) {
          currentResult.then(value => {
            currentResult = value;
            handler();
          });
        } else {
          handler();
        }
      };
  
      handler();
    }
  }
  
  const d = new Deferred(resolve => {
    setTimeout(() => {
      resolve(10);
    }, 1_000);
  });
  
  // 1
  /* d.then(value => {
    console.log(value); // 10
    return 15
  }).then((value) => {
    console.log(value);
  }); */
  
  // 2
  /* d.then(value => {
    console.log(value); // 10
  
    return new Deferred(resolve => {
      setTimeout(() => {
        resolve(15);
      }, 1_000);
    });
  }).then(value => {
    console.log(value); // 15
  }); */
  
  //3
   setTimeout(() => {
     d.then(v => console.log(v)); // 10
   }, 2_000);
  
  /*const p = Promise.resolve(5);
  const p2 = p.then(() => 10);
  console.log(p2 === p); // false
  p2.then(console.log); // 10
  p.then(console.log); // 5 */
  


  /*-------- */




  class Deferred {
    constructor(cb) {
      this.state = 'pending';
      this.callbacks = [];
      this.resolve = this.resolve.bind(this);
      this.value = undefined;
      cb(this.resolve);
    }
  
    then(cb) {
      return new Deferred(resolve => {
        const handler = value => {
          const newValue = cb(value);
          if (newValue instanceof Deferred) {
            newValue.then((value) => {
              resolve(value);
            })
          } else {
            resolve(newValue);
          }
        };
  
        if (this.state === 'pending') {
          this.callbacks.push(handler);
        } else {
          handler(this.value)
        }
      });
    }
  
    resolve(value) {
      this.state = 'fulfilled';
      this.value = value;
  
      for (let i = 0; i < this.callbacks.length; i++) {
        const callback = this.callbacks[i];
        callback(this.value);
      }
    }
  }
  
  const d = new Deferred(resolve => {
    setTimeout(() => {
      resolve(10);
    }, 1_000);
  });
  
  // 1
  /* d.then(value => {
    console.log(value); // 10
    return 15
  }).then((value) => {
    console.log(value);
  }); */
  
  // 2
  // d.then(value => {
  //   console.log(value); // 10
  
  //   return new Deferred(resolve => {
  //     setTimeout(() => {
  //       resolve(15);
  //     }, 1_000);
  //   });
  // }).then(value => {
  //   console.log(value); // 15
  // });
  
  // 3
  // setTimeout(() => {
  //   d.then(v => console.log(v)); // 10
  // }, 2_000);
  
  // 4
  // const p = new Deferred(res => res(5));
  // const p2 = p.then(value => 10);
  // console.log(p2 === p); // false
  // p.then(console.log); // 5
  // p.then(console.log); // 5
  // p2.then(console.log); // 10
  