import calculerImpots, { DEFAULT } from "../../rules/impots";
import { FormProps } from "./types";

export default function SimpleForm(props: FormProps) {
  return (
    <form
      class="w-96 grid gap-4 grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        props.onSubmit(
          calculerImpots({
            annuelBrut: Number(formData.get("annuel_brut")),
            nombreDeMois: Math.trunc(Number(formData.get("nombre_de_mois"))),
          })
        );
      }}
    >
      <div class="grid gap-1">
        <label for="annuel_brut">Annuel brut</label>
        <input autofocus id="annuel_brut" name="annuel_brut" required class="input" type="number" min="1" placeholder="35000" />
      </div>
      <div class="grid gap-1">
        <label for="nombre_de_mois">Nombre de mois</label>
        <input
          id="nombre_de_mois"
          name="nombre_de_mois"
          value={DEFAULT.nombreDeMois}
          required
          class="input"
          type="number"
          min="1"
          max="16"
        />
      </div>
      <div class="col-span-2 flex justify-end">
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
