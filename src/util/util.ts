export const debounce = (mainFunction: Function, delay: number = 1000) => {
  console.log('insdie debounce')
  // Declare a variable called 'timer' to store the timer ID
  let timer;

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    console.log('inside debounce return')
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {
      console.log('inside debounce return executing mainFunction')
      mainFunction(...args);
    }, delay);
  };
};