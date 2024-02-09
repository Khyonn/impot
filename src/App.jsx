import { createSignal } from "solid-js";
import getCalculImpots, { TAXE_BRUT_NET, TRANCHES } from "./impots";
import "./style.css";

const amountFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
function Amount(props) {
  return <>{amountFormatter.format(props.children)}</>;
}

function App() {
  const [tranches] = createSignal(TRANCHES);
  const [result, setResult] = createSignal();

  /** @type {HTMLFormElement}  */
  let form;
  const onSubmit = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    setResult(getCalculImpots(...tranches())(Number(data.annuel_brut), Number(data.nombre_de_mois)));
  };

  return (
    <div class="p-4 flex flex-wrap gap-4">
      <section class="grid gap-2">
        <h2 class="text-xl">Tranches d'imposition</h2>
        <ul class="list-disc pl-10">
          <For each={tranches()}>
            {(tranche) =>
              tranche[0] ? (
                <li>
                  Jusqu'à <Amount>{tranche[0]}</Amount> à {tranche[1]}%
                </li>
              ) : (
                <li>Et au-delà à {tranche[1]}%</li>
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
      <section class="w-80 grid gap-2">
        <h2 class="text-xl">Calculer mes impôts</h2>
        <form
          class="grid grid-cols-2 gap-2"
          ref={form}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(event);
          }}
        >
          <div class="col-span-2 grid items-center grid-cols-subgrid">
            <label for="">Annuel brut</label>
            <input
              id="annuel_brut"
              name="annuel_brut"
              required
              class="input"
              type="number"
              min="1"
              placeholder="35000"
            />
          </div>
          <div class="col-span-2 grid items-center grid-cols-subgrid">
            <label for="">Nombre de mois</label>
            <input
              id="nombre_de_mois"
              name="nombre_de_mois"
              required
              class="input"
              type="number"
              value="12"
              min="12"
              max="16"
            />
          </div>
          <div class="col-span-2 flex justify-end">
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition"
              type="submit"
            >
              Calculer
            </button>
          </div>
        </form>
      </section>
      {result() && (
        <section>
          <hr />
          <p>
            Pour un salaire annuel brut de{" "}
            <strong>
              <Amount>{result().annuelBrut}</Amount>
            </strong>
            , on considèrera pour la suite que vous touchez{" "}
            <strong>
              <Amount>{result().annuelNet}</Amount> net
            </strong>{" "}
            (les différentes taxes s'élevant à environ {(TAXE_BRUT_NET * 100).toFixed(2)}%)
          </p>
          <div>
            Vous payez donc :
            <ol class="list-disc pl-10">
              <For each={result().montantParTranche}>
                {([montant, pourcentage]) => (
                  <li>
                    <Amount>{montant}</Amount> à un taux de {pourcentage}% (
                    <Amount>{(montant * pourcentage) / 100}</Amount>)
                  </li>
                )}
              </For>
            </ol>
            <p>
              Le montant total de votre impôt est de{" "}
              <strong>
                <Amount>{result().impotTotal}</Amount>
              </strong>{" "}
              ce qui représente <strong>{result().pourcentageDImpotSurLAnnuelNet.toFixed(2)}%</strong> de votre annuel
              net
            </p>
            <p>
              Sur {result().mois} mois, si vous appliquez ce pourcentage sur chaque mois, vous touchez{" "}
              <strong>
                <Amount>{result().mensuelNetApresImpot}</Amount>
              </strong>
              /mois net après impôt
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
