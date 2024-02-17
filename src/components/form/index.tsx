import { createEffect, createSignal, on } from "solid-js";
import { useSearchParams } from "~/context/SearchParams";
import { doTransition } from "~/helpers/transitions-api";

import SimpleForm from "./Simple";
import SpecificForm from "./Specific";
import type { FormProps } from "./types";

export default function ImpotsForm(props: FormProps) {
  const [params, setParams] = useSearchParams<{ formType: string }>();
  const getIsSpecificFromParams = () => params.formType === "specific";
  const [isSpecific, setIsSpecific] = createSignal(getIsSpecificFromParams());
  createEffect(
    on(getIsSpecificFromParams, (isSpecificNow) => {
      if (isSpecific() !== isSpecificNow) {
        doTransition(() => {
          setIsSpecific(isSpecificNow);
        });
      }
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
              setParams({ formType: isSpecific() ? undefined : "specific" });
            });
          }}
        >
          Accéder au formulaire {isSpecific() ? "simplifié" : "complet"}
        </button>
      </div>
    </>
  );
}
