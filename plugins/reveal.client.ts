import type { Directive, DirectiveBinding } from "vue";

type RevealOptions = {
  delay?: number;
  variant?: "up" | "fade";
};

const observers = new WeakMap<HTMLElement, IntersectionObserver>();

function readOptions(binding: DirectiveBinding<number | RevealOptions | undefined>) {
  const value = binding.value;

  if (typeof value === "number") {
    return { delay: value, variant: "up" as const };
  }

  return {
    delay: value?.delay ?? 0,
    variant: value?.variant ?? "up",
  };
}

/**
 * `v-reveal` memunculkan elemen sekali saat masuk viewport.
 * Binding bisa berupa delay (number) atau { delay, variant }.
 */
const reveal: Directive<HTMLElement, number | RevealOptions | undefined> = {
  mounted(el, binding) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const { delay, variant } = readOptions(binding);

    el.dataset.reveal = variant;
    if (delay) {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          el.classList.add("is-revealed");
          observer.disconnect();
          observers.delete(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    observers.set(el, observer);
    observer.observe(el);
  },
  unmounted(el) {
    observers.get(el)?.disconnect();
    observers.delete(el);
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", reveal);
});
