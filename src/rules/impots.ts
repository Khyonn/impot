type Tranches = { max: number; pourcentage: number }[];

export const TRANCHES: Record<number, Tranches> = {
  2023: [
    { max: 10_777, pourcentage: 0 },
    { max: 27_478, pourcentage: 11 },
    { max: 78_570, pourcentage: 30 },
    { max: 168_994, pourcentage: 41 },
    { max: Infinity, pourcentage: 45 },
  ],
  2024: [
    { max: 11_294, pourcentage: 0 },
    { max: 28_797, pourcentage: 11 },
    { max: 82_341, pourcentage: 30 },
    { max: 177_106, pourcentage: 41 },
    { max: Infinity, pourcentage: 45 },
  ],
};

export const DEFAULT = {
  tranches: TRANCHES[2024],
  pourcentageCotisationsBrutNet: 25,
  nombreDeMois: 12,
  nombreDePart: 1,
};

export type CalculerImpotsParam = { annuelBrut: number } & Partial<typeof DEFAULT>;
export default function calculerImpots(params: CalculerImpotsParam) {
  const parametres = { ...DEFAULT, ...params };
  const { annuelBrut, tranches, nombreDeMois, nombreDePart, pourcentageCotisationsBrutNet } = parametres;

  const annuelNet = annuelBrut * (1 - pourcentageCotisationsBrutNet / 100);
  const montantImposable = annuelNet / nombreDePart;
  const montantParTranche = tranches.map(({ max, pourcentage }, index) => {
    const applicable = !index || tranches[index - 1].max < montantImposable;
    if (!applicable) {
      return { montant: 0, pourcentage, total: 0 };
    }
    const montantTranchePrecedente = !index ? 0 : tranches[index - 1].max;
    const montant = (max > montantImposable ? montantImposable : max) - montantTranchePrecedente;
    return { montant, pourcentage, total: (pourcentage / 100) * montant };
  });
  const montantImpotTotal = montantParTranche.reduce((total, { total: totalTranche }) => total + totalTranche, 0);
  const pourcentageDImpotSurLAnnuelNet = (montantImpotTotal * 100) / annuelNet;
  const annuelNetApresImpot = annuelNet - montantImpotTotal;
  const mensuelNet = annuelNet / nombreDeMois;
  const mensuelNetApresImpot = annuelNetApresImpot / nombreDeMois;

  return {
    parametres,
    resultats: {
      annuelNet,
      annuelNetApresImpot,
      montantParTranche,
      montantImpotTotal,
      pourcentageDImpotSurLAnnuelNet,
      mensuelNet,
      mensuelNetApresImpot,
    },
  };
}

export type CalculerImpotsReturn = ReturnType<typeof calculerImpots>;
