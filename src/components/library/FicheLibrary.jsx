import { useEffect, useState } from 'react';
import { fetchAllFiches } from '../../services/fichesService';

const CATEGORY_LABELS = {
  maladie: 'Maladies',
  entretien: 'Entretiens',
  agenda: 'Agenda mensuel',
};

const CATEGORY_ORDER = ['maladie', 'entretien', 'agenda'];

const MONTH_ORDER = [
  'Agenda Janvier', 'Agenda Février', 'Agenda Mars', 'Agenda Avril',
  'Agenda Mai', 'Agenda Juin', 'Agenda Juillet', 'Agenda Août',
  'Agenda Septembre', 'Agenda Octobre', 'Agenda Novembre', 'Agenda Décembre',
];

function sortFiches(fiches, categorie) {
  if (categorie === 'agenda') {
    return [...fiches].sort(
      (a, b) => MONTH_ORDER.indexOf(a.titre) - MONTH_ORDER.indexOf(b.titre)
    );
  }
  return fiches;
}

export default function FicheLibrary({ initialTitre, onClose }) {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('maladie');
  const [selectedFiche, setSelectedFiche] = useState(null);

  useEffect(() => {
    fetchAllFiches()
      .then((data) => {
        setFiches(data);
        // Si on arrive depuis un diagnostic avec une fiche précise à ouvrir
        if (initialTitre) {
          const match = data.find((f) => f.titre === initialTitre);
          if (match) {
            setSelectedFiche(match);
            setActiveCategory(match.categorie);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [initialTitre]);

  if (loading) {
    return <p className="app__loading">Chargement de la bibliothèque...</p>;
  }

  if (selectedFiche) {
    return (
      <div className="fiche-library">
        <button className="fiche-library__back" onClick={() => setSelectedFiche(null)}>
          ← Retour à la liste
        </button>
        <span className="eyebrow">{CATEGORY_LABELS[selectedFiche.categorie]}</span>
        <h2>{selectedFiche.titre}</h2>
        <div className="gold-divider">
          <span className="gold-divider__mark" />
        </div>
        <p className="fiche-library__content">{selectedFiche.contenu}</p>
      </div>
    );
  }

  const fichesInCategory = sortFiches(
    fiches.filter((f) => f.categorie === activeCategory),
    activeCategory
  );

  return (
    <div className="fiche-library">
      <span className="eyebrow">Bibliothèque</span>
      <h2>Fiches gazon</h2>

      <div className="fiche-library__tabs">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            className={`fiche-library__tab ${activeCategory === cat ? 'fiche-library__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <ul className="fiche-library__list">
        {fichesInCategory.map((fiche) => (
          <li key={fiche.id}>
            <button
              className="fiche-library__item"
              onClick={() => setSelectedFiche(fiche)}
            >
              {fiche.titre}
              <span className="fiche-library__arrow">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
