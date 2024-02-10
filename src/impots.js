export const TRANCHES = [
    [11_294, 0],
    [28_797, 11],
    [82_341, 30],
    [177_106, 41],
    [, 45]
];

export const TAXE_BRUT_NET = 0.25

export const MOIS = 12

export default function getCalculImpots (...tranches) {
    return function (annuelBrut, mois = MOIS) {
        const annuelNet = annuelBrut * (1 - TAXE_BRUT_NET);
        const tranchesAAppliquer = tranches.filter((_, index) => !index || tranches[index - 1][0] < annuelNet);
        const montantParTranche = tranchesAAppliquer.map(([max, pourcentage], index) => {
            const isFirst = !index;
            const isLast = tranchesAAppliquer.length - 1 === index;
            const lastAmount = isFirst ? 0 : tranchesAAppliquer[index - 1][0];
            return [(isLast ? annuelNet : max) - (lastAmount), pourcentage]
        });
        const impotTotal = montantParTranche.reduce((total, [montant, pourcentage]) => total + (montant * pourcentage / 100), 0)
        const pourcentageDImpotSurLAnnuelNet = impotTotal * 100 / annuelNet
        const mensuelNetApresImpot = (annuelNet / mois) * (100 - pourcentageDImpotSurLAnnuelNet) / 100
        return {
            tranches,
            annuelBrut,
            mois,
            annuelNet,
            montantParTranche,
            impotTotal,
            pourcentageDImpotSurLAnnuelNet,
            mensuelNetApresImpot
        }
    }
}
