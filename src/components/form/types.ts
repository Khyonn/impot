import calculerImpots from "~/rules/impots";

export type FormProps = {
  onSubmit: (results: ReturnType<typeof calculerImpots>) => void;
};
