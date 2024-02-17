import { For, createEffect, createSignal, on } from "solid-js";
import calculerImpots, { DEFAULT, type CalculerImpotsReturn } from "./rules/impots";

import Amount from "./components/Amount";
import ImpotsForm from "./components/form";
import Pourcentage from "./components/Pourcentage";
import ResultatComplet from "./components/resultat/Complet";

import "./style.css";

export default function App() {
  const [calcul, setCalcul] = createSignal<CalculerImpotsReturn | undefined>(
    import.meta.env.DEV ? calculerImpots({ annuelBrut: 42000 }) : undefined
  );

  let resultSection: HTMLDivElement | undefined;
  let calculSection: HTMLDivElement | undefined;

  createEffect(
    on(calcul, () => {
      resultSection?.scrollIntoView();
    })
  );

  return (
    <>
      <section ref={calculSection} class="h-svh" style="view-transition-name: impot-form">
        <div class="bg-white shadow-lg rounded-lg mx-2 p-4 grid gap-4">
          <h2 class="text-lg tall:text-xl font-semibold text-slate-800">Mon salaire réel</h2>
          <ImpotsForm onSubmit={setCalcul} />
        </div>
      </section>
      {calcul() && (
        <>
          <section ref={resultSection} class="h-screen">
            <div class="container bg-white rounded-lg shadow-lg p-4 grid gap-4">
              <h2 class="sr-only">Résultats</h2>
              <ResultatComplet calcul={calcul()!} />
            </div>
          </section>
          <button
            onClick={() => {
              calculSection?.scrollIntoView();
            }}
            class="btn-scroll-up"
          >
            <span aria-hidden>⇧</span>
            <span class="sr-only">Remonter au calcul</span>
          </button>
        </>
      )}
      <section classList={{ "sr-only": !calcul() || calcul()?.parametres.annuelBrut !== 42 }}>
        <h2 class="text-lg tall:text-xl font-semibold">Tranches d'imposition</h2>
        <ul class="list-disc pl-10">
          <For each={DEFAULT.tranches}>
            {(tranche) =>
              tranche.max !== Infinity ? (
                <li>
                  Jusqu'à <Amount>{tranche.max}</Amount> à <Pourcentage>{tranche.pourcentage}</Pourcentage>
                </li>
              ) : (
                <li>
                  Et au-delà à <Pourcentage>{tranche.pourcentage}</Pourcentage>
                </li>
              )
            }
          </For>
        </ul>
        <em class="italic">
          Source :{" "}
          <a
            class="text-blue-500 hover:text-blue-600"
            href="https://www.economie.gouv.fr/particuliers/tranches-imposition-impot-revenu#bar-me-de-l-imp-t-2024-les-tapes_1"
            target="_blank"
          >
            Comment calculer votre impôt d'après le barème de l'impôt sur le revenu ?
          </a>
        </em>
      </section>
    </>
  );
}
