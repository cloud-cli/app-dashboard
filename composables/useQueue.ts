import { ref } from "vue";

export function useQueue() {
  const queue: any[] = [];
  const queueRef = ref(null);

  function run(v) {
    queueRef.value = v;
    queue.forEach((f) => f(v));
  }

  function whenReady(next) {
    if (!queueRef.value) {
      queue.push(next);
      return;
    }

    next(queueRef.value);
  }

  return { run, whenReady };
}
