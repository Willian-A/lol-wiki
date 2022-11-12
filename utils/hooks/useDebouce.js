export default function useDebounce(ousideFunction) {
  let timeout;
  return (...args) => {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      ousideFunction.apply(context, args);
    }, 250);
  };
}
