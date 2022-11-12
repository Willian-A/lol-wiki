export default function useDebounce(inputValue, outsideFunction) {
  let filterTimeout;

  clearTimeout(filterTimeout);

  filterTimeout = setTimeout(() => {
    outsideFunction(inputValue);
  }, 250);
}
