import { For, createEffect, createSignal, on } from "solid-js";
import Amount from "./components/Amount";
import ImpotsForm from "./components/form";
import { DEFAULT, type CalculerImpotsReturn } from "./rules/impots";

import "./style.css";
import Pourcentage from "./components/Pourcentage";

function App() {
  const [calcul, setCalcul] = createSignal<CalculerImpotsReturn>();

  let resultSection: HTMLDivElement | undefined;

  createEffect(
    on(calcul, () => {
      resultSection?.scrollIntoView();
    })
  );

  return (
    <>
      <div class="h-svh bg-slate-50 flex justify-center items-center relative overflow-hidden isolate after:absolute after:bg-gradient-to-b after:from-green-100 after:to-green-400 after:w-full after:-top-1/2 after:-right-1/2 after:h-[200%] after:rotate-12 after:-z-10">
        <section class="bg-white shadow-lg rounded-lg mx-1 p-4 grid gap-4">
          <h2 class="text-lg tall:text-xl font-semibold text-slate-800">Mon salaire réel</h2>
          <ImpotsForm onSubmit={setCalcul} />
        </section>
      </div>
      {calcul() && (
        <div
          ref={resultSection}
          class="h-screen bg-slate-100 flex justify-center items-center p-2 relative overflow-hidden isolate after:absolute after:bg-gradient-to-b after:from-green-100 after:to-green-400 after:w-full after:-top-1/2 after:-left-3/4 after:h-[200%] after:-rotate-12 after:-z-10"
        >
          <section class="container bg-white rounded-lg shadow-lg p-4 grid gap-4">
            <h2 class="sr-only">Résultats</h2>
            <p class="text-justify">
              Pour un salaire{" "}
              <em class="underline">
                annuel brut de <Amount>{calcul()!.parametres.annuelBrut}</Amount>
              </em>{" "}
              et un pourcentage de cotisations estimé à{" "}
              <em class="underline">
                <Pourcentage>{calcul()!.parametres.pourcentageCotisationsBrutNet}</Pourcentage>
              </em>
              , vous touchez{" "}
              <em class="font-semibold">
                un annuel net de <Amount>{calcul()!.resultats.annuelNet}</Amount>
              </em>
              .
            </p>
            <div class="grid gap-2">
              Sur cet annuel net, par tranches, vous êtes imposé de :
              <ol class="list-disc pl-8">
                <For each={calcul()!.resultats.montantParTranche}>
                  {({ montant, pourcentage, total }) => (
                    <li classList={{ "opacity-50": !total }}>
                      <em class="font-semibold">
                        <Amount>{total}</Amount>
                      </em>{" "}
                      (<Amount>{montant}</Amount> à un taux de <Pourcentage>{pourcentage}</Pourcentage>)
                    </li>
                  )}
                </For>
              </ol>
              <p class="text-justify">
                Le montant annuel total de votre impôt est donc de{" "}
                <em class="font-semibold">
                  <Amount>{calcul()!.resultats.montantImpotTotal}</Amount>
                </em>{" "}
                soit{" "}
                <em class="font-semibold">
                  <Pourcentage>{calcul()!.resultats.pourcentageDImpotSurLAnnuelNet}</Pourcentage>
                </em>
                .
              </p>
            </div>
            <p class="text-justify">
              Votre annuel net après impôts est donc de{" "}
              <strong class="inline-block whitespace-nowrap text-green-600 border border-green-600 px-1">
                <Amount>{calcul()!.resultats.annuelNetApresImpot}</Amount>
              </strong>
              <span class="sr-only">.</span>
              <br />
              Sur {calcul()!.parametres.nombreDeMois} mois, cela ramène votre mensuel net après impôts à{" "}
              <strong class="inline-block whitespace-nowrap text-green-600 border border-green-600 px-1">
                <Amount>{calcul()!.resultats.mensuelNetApresImpot}</Amount>
              </strong>
              <span class="sr-only">.</span>
            </p>
          </section>
        </div>
      )}

      <section class="sr-only">
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

export default App;
