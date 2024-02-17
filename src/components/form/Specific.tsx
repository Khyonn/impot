import { useSearchParams } from "~/context/SearchParams";
import calculerImpots, { DEFAULT } from "~/rules/impots";
import type { FormProps } from "./types";
import { onCleanup } from "solid-js";

export default function SpecificForm(props: FormProps) {
  const [, setParams] = useSearchParams();

  let form: HTMLFormElement | undefined;
  onCleanup(() => {
    setParams(
      Object.fromEntries(
        Object.keys(Object.fromEntries(new FormData(form!)) as Record<string, string>).map((key) => [key, undefined])
      )
    );
  });

  return (
    <form
      ref={form}
      class="w-60 sm:w-96 grid gap-4 sm:gap-2 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
        setParams(formData);
        props.onSubmit(
          calculerImpots({
            annuelBrut: Number(formData.annuel_brut),
            nombreDeMois: Math.trunc(Number(formData.nombre_de_mois)),
            pourcentageCotisationsBrutNet: Math.trunc(Number(formData.pourcentage_cotisations_brut_net)),
          })
        );
      }}
    >
      <div class="grid gap-1">
        <label for="annuel_brut">Annuel brut</label>
        <input autofocus id="annuel_brut" name="annuel_brut" required type="number" min="1" placeholder="35000" />
      </div>
      <div class="grid gap-1">
        <label for="nombre_de_mois">Nombre de mois</label>
        <input
          id="nombre_de_mois"
          name="nombre_de_mois"
          value={DEFAULT.nombreDeMois}
          required
          type="number"
          min="1"
          max="16"
        />
      </div>
      <div class="grid gap-1">
        <label for="pourcentage_cotisations_brut_net">Statut</label>
        <select id="pourcentage_cotisations_brut_net" name="pourcentage_cotisations_brut_net" class="input" required>
          <option value="22">Non cadre</option>
          <option value="25" selected>
            Cadre
          </option>
          <option value="11">Fonction publique</option>
          <option value="45">Profession libérale</option>
          <option value="51">Portage salarial</option>
        </select>
      </div>
      {import.meta.env.DEV && <></>}
      <div class="pt-2 sm:pt-0 sm:col-span-2 flex justify-end">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 active:bg-green-700 active:scale-95 transition"
          type="submit"
        >
          Calculer
        </button>
      </div>
    </form>
  );
}
