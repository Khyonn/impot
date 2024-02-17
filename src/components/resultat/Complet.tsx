import { For } from "solid-js";
import { CalculerImpotsReturn } from "~/rules/impots";

import Amount from "~/components/Amount";
import Pourcentage from "~/components/Pourcentage";

export default function ResultatComplet(props: { calcul: CalculerImpotsReturn }) {
  return (
    <>
      <p class="text-justify">
        Pour un salaire{" "}
        <em class="underline">
          annuel brut de <Amount>{props.calcul.parametres.annuelBrut}</Amount>
        </em>{" "}
        et un pourcentage de cotisations estimé à{" "}
        <em class="underline">
          <Pourcentage>{props.calcul.parametres.pourcentageCotisationsBrutNet}</Pourcentage>
        </em>
        , vous touchez{" "}
        <em class="font-semibold">
          un annuel net de <Amount>{props.calcul.resultats.annuelNet}</Amount>
        </em>
        .
      </p>
      <div class="grid gap-2">
        Sur cet annuel net, par tranches, vous êtes imposé de :
        <ol class="list-disc pl-8">
          <For each={props.calcul.resultats.montantParTranche}>
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
            <Amount>{props.calcul.resultats.montantImpotTotal}</Amount>
          </em>{" "}
          soit{" "}
          <em class="font-semibold">
            <Pourcentage>{props.calcul.resultats.pourcentageDImpotSurLAnnuelNet}</Pourcentage>
          </em>
          .
        </p>
      </div>
      <p class="text-justify">
        Votre annuel net après impôts est donc de{" "}
        <strong class="inline-block whitespace-nowrap text-green-600 border border-green-600 px-1">
          <Amount>{props.calcul.resultats.annuelNetApresImpot}</Amount>
        </strong>
        <span class="sr-only">.</span>
        <br />
        Sur {props.calcul.parametres.nombreDeMois} mois, cela ramène votre mensuel net après impôts à{" "}
        <strong class="inline-block whitespace-nowrap text-green-600 border border-green-600 px-1">
          <Amount>{props.calcul.resultats.mensuelNetApresImpot}</Amount>
        </strong>
        <span class="sr-only">.</span>
      </p>
    </>
  );
}
