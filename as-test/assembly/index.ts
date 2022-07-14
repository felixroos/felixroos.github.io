// The entry file of your WebAssembly module.

function test(func: () => i32): i32 {
  return func();
}

var n: i32;
export function add(x: i32): i32 {
  return test(() => {
    n = x;
    return x;
  });
}
