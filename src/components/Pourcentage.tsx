export default function Pourcentage(props: { children: number }) {
  return <>{Number(props.children.toFixed(2))} %</>;
}
