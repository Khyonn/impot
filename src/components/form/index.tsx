import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import SimpleForm from "./Simple";
import SpecificForm from "./Specific";
import { FormProps } from "./types";

const doTransition = (callback: () => any) => {
  if ("startViewTransition" in document && typeof document.startViewTransition === "function") {
    document.startViewTransition(callback);
  } else {
    callback();
  }
};

export default function ImpotsForm(props: FormProps) {
  const [isSpecific, setIsSpecific] = createSignal(new URLSearchParams(location.search).get("formType") === "specific");

  const onUrlChange = () => {
    doTransition(() => {
      setIsSpecific(new URLSearchParams(location.search).get("formType") === "specific");
    });
  };
  addEventListener("popstate", onUrlChange);

  onCleanup(() => {
    removeEventListener("popstate", onUrlChange);
  });

  createEffect(
    on(isSpecific, () => {
      document.getElementById("annuel_brut")?.focus();
    })
  );

  return (
    <>
      <div class="px-1">{isSpecific() ? <SpecificForm {...props} /> : <SimpleForm {...props} />}</div>
      <div class="flex justify-end">
        <button
          class="italic text-slate-400 transition-colors hover:text-slate-500 active:text-slate-600 text-xs relative isolate before:absolute before:-z-10 before:inset-0 before:border-b before:border-b-current before:origin-left before:transition-transform before:scale-x-0 hover:before:scale-x-100"
          onClick={() => {
            doTransition(() => {
              setIsSpecific((old) => !old);
              const newURL = new URL(location.href);
              if (isSpecific()) {
                newURL.searchParams.set("formType", "specific");
              } else {
                newURL.searchParams.delete("formType");
              }
              history.pushState(undefined, "", newURL);
            });
          }}
        >
          Accéder au formulaire {isSpecific() ? "simplifié" : "complet"}
        </button>
      </div>
    </>
  );
}
