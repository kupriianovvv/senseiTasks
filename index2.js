class Deferred {
    status = "pending";
    value = null;
    callbacks = [];
    nextPromise = null;
    constructor(callback) {
        if (callback) {
          callback(this.resolve);
        }
    }

    resolve = (value) => {
        this.status = "fulfilled";
        this.value = value;

        let currValue = value;
        for (const callback of this.callbacks) {
          currValue = callback(currValue)
        }


    }

    then(callback) {
        if (this.status === 'fulfilled') {
          const value = callback(this.value);
          return new Deferred(resolve => resolve(value))
        }
        this.callbacks.push(callback); 
        return new Deferred(resolve => {
          this.callbacks.push((value) => resolve(value))
        })
    }
    
}

const d = new Deferred(resolve => {
    setTimeout(() => {
      resolve(10);
    }, 1_000);
});


  // 1
   d.then(value => {
    console.log(value); // 10
    return 15
  }).then((value) => {
    console.log(value);
  });


  setTimeout(() => {
   d.then(v => console.log(v)); // 10
   }, 2_000);
   

      const p = new Deferred(res => res(5));
   const p2 = p.then(value => 10);
   console.log(p2 === p); // false
   p.then(console.log); // 5
   p.then(console.log); // 5
   p2.then(console.log); // 10