import calculerImpots from "~/rules/impots";
import type { FormProps } from "./types";

export default function SimpleForm(props: FormProps) {
  return (
    <form
      class="w-64 grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit(calculerImpots({ annuelBrut: Number(new FormData(event.currentTarget).get("annuel_brut")) }));
      }}
    >
      <div class="grid gap-1">
        <label for="annuel_brut">Annuel brut</label>
        <input autofocus id="annuel_brut" name="annuel_brut" required type="number" min="1" placeholder="35000" />
      </div>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 active:bg-green-700 active:scale-95 transition"
        type="submit"
      >
        Calculer
      </button>
    </form>
  );
}
