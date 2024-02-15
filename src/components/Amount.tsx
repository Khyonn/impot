const amountFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function Amount(props: { children: number }) {
  return <>{amountFormatter.format(props.children)}</>;
}
