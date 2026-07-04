import { useState } from 'react';

const FILL = (text) => (
  <span style={{ background: '#fef9c3', border: '1px solid #fbbf24', borderRadius: 4, padding: '1px 6px', fontWeight: 700, color: '#92400e', fontSize: 13 }}>{text}</span>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1b4332', marginBottom: 12, paddingTop: 16, borderTop: '1px solid #e5e5e3' }}>{title}</h2>
    {children}
  </div>
);

const P = ({ children }) => (
  <p style={{ fontSize: 13, color: '#333', marginBottom: 10, lineHeight: 1.75 }}>{children}</p>
);

const Li = ({ children }) => (
  <li style={{ fontSize: 13, color: '#333', marginBottom: 5, lineHeight: 1.65 }}>{children}</li>
);

const Warning = ({ children }) => (
  <div style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', borderRadius: '0 8px 8px 0', padding: '14px 18px', margin: '14px 0' }}>
    <p style={{ margin: 0, color: '#7f1d1d', fontSize: 13, lineHeight: 1.65 }}>{children}</p>
  </div>
);

const Info = ({ children }) => (
  <div style={{ background: '#f0faf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', margin: '14px 0' }}>
    <p style={{ margin: 0, color: '#166534', fontSize: 13, lineHeight: 1.65 }}>{children}</p>
  </div>
);

function CGV({ onBack }) {
  return (
    <div className="fiche-library" style={{ paddingBottom: '6rem' }}>
      <button className="fiche-library__back" onClick={onBack}>← Retour</button>
      <span className="eyebrow">Documents légaux</span>
      <h2>Conditions Générales de Vente</h2>
      <div style={{ marginTop: 8, marginBottom: 20, fontSize: 12, color: 'var(--text-dim)' }}>
        Version du {FILL('[DATE À COMPLÉTER]')}
      </div>

      <Warning>⚠️ CLAUSE ESSENTIELLE — En utilisant le service de diagnostic IA, vous reconnaissez et acceptez sans réserve l'intégralité des limitations de responsabilité décrites dans ces CGV.</Warning>

      <Section title="Article 1 — Éditeur">
        <P>Mon Expert Jardin est édité par <strong>Louis DILIGENT</strong>, micro-entrepreneur.</P>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>SIRET : {FILL('[À COMPLÉTER]')}</Li>
          <Li>Adresse : {FILL('[À COMPLÉTER]')}</Li>
          <Li>Email : {FILL('[À COMPLÉTER]')}</Li>
          <Li>Site : monexpertjardin.fr</Li>
        </ul>
      </Section>

      <Section title="Article 2 — Objet">
        <P>Les présentes CGV régissent les relations entre Louis DILIGENT et tout utilisateur souhaitant accéder aux services de l'application Mon Expert Jardin. Toute utilisation implique l'acceptation sans réserve des présentes conditions.</P>
      </Section>

      <Section title="Article 3 — Description du service">
        <P>Mon Expert Jardin est une application proposant : diagnostic IA gazon et piscine, fiches techniques, agenda mensuel, boutique de produits et profil personnalisé.</P>
        <Warning>⚠️ Les diagnostics fournis par l'intelligence artificielle sont générés à titre purement indicatif. Ils ne constituent en aucun cas un avis professionnel. L'Éditeur décline toute responsabilité pour les décisions prises sur leur base.</Warning>
      </Section>

      <Section title="Article 4 — Tarifs">
        <P>Les abonnements proposés sont :</P>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li><strong>Expert Gazon :</strong> 4,99€/mois ou 49€/an</Li>
          <Li><strong>Expert Piscine :</strong> 3,99€/mois ou 39€/an</Li>
          <Li><strong>Gazon + Piscine :</strong> 7,99€/mois ou 79€/an</Li>
        </ul>
        <P>Prix nets de TVA (micro-entrepreneur non assujetti — art. 293 B du CGI). L'abonnement annuel offre une économie d'environ 18% par rapport au tarif mensuel.</P>
      </Section>

      <Section title="Article 5 — Paiement">
        <P>Les paiements sont traités par <strong>Stripe</strong> de manière sécurisée. Les données bancaires ne transitent jamais par nos serveurs. Moyens acceptés : Visa, Mastercard, American Express.</P>
      </Section>

      <Section title="Article 6 — Rétractation">
        <P>Vous disposez de <strong>14 jours</strong> pour vous rétracter sans justification. L'Éditeur offre également une <strong>garantie satisfait ou remboursé de 30 jours</strong> pour tout nouvel abonné. Demande à adresser à {FILL('[EMAIL]')}.</P>
      </Section>

      <Section title="Article 7 — Résiliation">
        <P>L'abonnement est renouvelé automatiquement. Vous serez informé 30 jours avant le renouvellement. Résiliation possible à tout moment depuis votre espace ou par email, au moins 48h avant le renouvellement.</P>
      </Section>

      <Section title="Article 8 — Exclusion totale de responsabilité IA et Produits">
        <Warning>⚠️ CLAUSE FONDAMENTALE — L'Éditeur exclut expressément et totalement toute responsabilité pour les conséquences de l'utilisation des diagnostics IA et des produits recommandés.</Warning>

        <P><strong>8.1 — Diagnostics IA</strong></P>
        <P>Les analyses sont générées de manière entièrement automatisée. L'Éditeur exclut toute responsabilité pour :</P>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>Dégradation, détérioration ou destruction du gazon, de la pelouse ou tout espace vert</Li>
          <Li>Dégradation de la qualité de l'eau d'une piscine ou d'un bassin</Li>
          <Li>Dommages aux équipements (pompe, filtre, robot, liner, revêtement, structure)</Li>
          <Li>Préjudices corporels liés à une baignade dans une eau traitée sur la base d'un diagnostic IA</Li>
          <Li>Diagnostic erroné, incomplet, imprécis ou inadapté à votre situation</Li>
          <Li>Non-détection d'un problème non visible sur photo</Li>
        </ul>

        <P><strong>8.2 — Produits recommandés</strong></P>
        <P>L'Éditeur exclut toute responsabilité pour :</P>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>Dommages causés par l'utilisation d'un produit recommandé par l'IA</Li>
          <Li>Réactions allergiques, irritations ou atteintes à la santé liées aux produits chimiques</Li>
          <Li>Effets sur la faune, la flore ou l'environnement</Li>
          <Li>Erreurs de dosage, même basées sur les recommandations de l'application</Li>
          <Li>Qualité ou effets des produits achetés auprès de tiers (Amazon ou autres)</Li>
        </ul>
        <P>L'Utilisateur est seul responsable de lire les notices, respecter les dosages fabricant et consulter un professionnel en cas de doute.</P>

        <P><strong>8.3 — Obligations de l'Utilisateur</strong></P>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>Vérifier les recommandations auprès d'un professionnel avant toute application importante</Li>
          <Li>En cas de doute, s'abstenir d'agir sur la seule base de l'analyse IA</Li>
          <Li>Respecter les réglementations en vigueur (ex: interdiction désherbage chimique particuliers depuis 2019)</Li>
        </ul>

        <P><strong>8.4 — Plafond de responsabilité</strong></P>
        <P>Dans les cas où la responsabilité de l'Éditeur ne pourrait être totalement exclue, elle est limitée au montant total des abonnements payés au cours des 12 derniers mois. Aucun dommage indirect, immatériel ou consécutif ne saurait être mis à sa charge.</P>
      </Section>

      <Section title="Article 9 — Propriété intellectuelle">
        <P>Tous les contenus (textes, fiches, algorithmes, logo, interface) sont la propriété exclusive de Louis DILIGENT. Toute reproduction sans autorisation est interdite.</P>
      </Section>

      <Section title="Article 10 — Droit applicable et litiges">
        <P>Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux français. En cas de litige, vous pouvez recourir gratuitement à un médiateur de la consommation ou à la plateforme européenne : <strong>ec.europa.eu/consumers/odr</strong></P>
      </Section>
    </div>
  );
}

function MentionsLegales({ onBack }) {
  return (
    <div className="fiche-library" style={{ paddingBottom: '6rem' }}>
      <button className="fiche-library__back" onClick={onBack}>← Retour</button>
      <span className="eyebrow">Documents légaux</span>
      <h2>Mentions Légales & Confidentialité</h2>
      <div style={{ marginTop: 8, marginBottom: 20, fontSize: 12, color: 'var(--text-dim)' }}>
        Version du {FILL('[DATE À COMPLÉTER]')}
      </div>

      {/* MENTIONS LÉGALES */}
      <div style={{ background: '#f0faf4', borderLeft: '4px solid #1b4332', borderRadius: '0 10px 10px 0', padding: '14px 18px', marginBottom: 24 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#1b4332', fontSize: 14 }}>📋 Partie 1 — Mentions Légales</p>
      </div>

      <Section title="Éditeur">
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li><strong>Louis DILIGENT</strong> — Micro-entrepreneur</Li>
          <Li>SIRET : {FILL('[À COMPLÉTER]')}</Li>
          <Li>Adresse : {FILL('[À COMPLÉTER]')}</Li>
          <Li>Email : {FILL('[À COMPLÉTER]')}</Li>
        </ul>
      </Section>

      <Section title="Hébergement">
        <P><strong>Vercel Inc.</strong> — San Francisco, USA (application)</P>
        <P><strong>Supabase Inc.</strong> — Singapour (base de données)</P>
        <P><strong>Stripe Inc.</strong> — San Francisco, USA (paiements)</P>
        <P><strong>OpenAI LLC</strong> — San Francisco, USA (IA)</P>
      </Section>

      <Section title="Exclusion de responsabilité IA et Produits">
        <Warning>⚠️ CLAUSE FONDAMENTALE — Louis DILIGENT, éditeur de Mon Expert Jardin, exclut expressément et totalement toute responsabilité pour les conséquences directes ou indirectes résultant de l'utilisation des diagnostics IA et des produits recommandés.</Warning>
        <P>Les diagnostics sont générés de manière entièrement automatisée et fournis à titre purement informatif. L'Éditeur exclut toute responsabilité pour : dégradation du gazon ou de la piscine, dommages aux équipements, préjudices corporels, erreurs de dosage, effets des produits recommandés.</P>
        <P>L'Utilisateur est seul responsable des décisions prises sur la base des diagnostics. En cas de doute, il doit consulter un professionnel qualifié.</P>
        <Info>📌 Rappel : le désherbage chimique est interdit aux particuliers en France depuis 2019 (Loi Labbé). L'application ne recommande que des solutions mécaniques ou naturelles.</Info>
      </Section>

      <Section title="Affiliation Amazon">
        <P>Mon Expert Jardin participe au programme Partenaires d'Amazon EU. Certains liens vers des produits sont des liens affiliés susceptibles de générer une commission, sans coût supplémentaire pour l'Utilisateur.</P>
      </Section>

      {/* RGPD */}
      <div style={{ background: '#f0faf4', borderLeft: '4px solid #1b4332', borderRadius: '0 10px 10px 0', padding: '14px 18px', margin: '32px 0 24px' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#1b4332', fontSize: 14 }}>🔒 Partie 2 — Politique de Confidentialité (RGPD)</p>
      </div>

      <Section title="Données collectées">
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>Email et mot de passe (compte)</Li>
          <Li>Ville, surface pelouse, volume piscine (personnalisation)</Li>
          <Li>Photos uploadées pour les diagnostics IA</Li>
          <Li>Historique des diagnostics</Li>
          <Li>Données de transaction (via Stripe)</Li>
        </ul>
        <P>Les données de carte bancaire ne transitent jamais par nos serveurs — traitées exclusivement par Stripe (PCI-DSS).</P>
      </Section>

      <Section title="Utilisation des données">
        <P>Vos données sont utilisées pour : fourniture du service, personnalisation des conseils, traitement des paiements, communications relatives à votre abonnement. Aucune donnée n'est vendue à des tiers.</P>
        <Info>📌 Les photos envoyées pour diagnostic sont transmises à l'API OpenAI pour analyse uniquement. Elles ne sont pas utilisées pour entraîner des modèles IA. Elles sont supprimées automatiquement après 12 mois.</Info>
      </Section>

      <Section title="Conservation des données">
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>Données de compte : durée de l'abonnement + 3 ans</Li>
          <Li>Photos de diagnostic : 12 mois maximum</Li>
          <Li>Données de facturation : 10 ans (obligation légale)</Li>
          <Li>Logs de connexion : 12 mois</Li>
        </ul>
      </Section>

      <Section title="Vos droits RGPD">
        <P>Conformément au RGPD, vous disposez des droits d'accès, rectification, effacement, portabilité, opposition et limitation. Pour exercer ces droits : {FILL('[EMAIL]')}</P>
        <P>En cas de réclamation non satisfaite, vous pouvez saisir la <strong>CNIL</strong> (www.cnil.fr).</P>
      </Section>

      <Section title="Cookies">
        <P>Seuls des cookies techniques strictement nécessaires au fonctionnement sont utilisés (session, authentification JWT). Aucun cookie publicitaire ou de traçage tiers.</P>
      </Section>

      <Section title="Sécurité">
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <Li>HTTPS imposé sur toutes les connexions (TLS 1.3)</Li>
          <Li>Authentification sécurisée par tokens JWT</Li>
          <Li>Row Level Security (RLS) sur la base de données</Li>
          <Li>Mots de passe hachés (bcrypt) — jamais accessibles en clair</Li>
        </ul>
      </Section>

      <Section title="Contact">
        <P>Pour toute question relative à vos données personnelles : {FILL('[EMAIL À COMPLÉTER]')}</P>
        <P>Délai de réponse : 30 jours maximum.</P>
      </Section>
    </div>
  );
}

export default function LegalPages({ page, onBack }) {
  if (page === 'cgv') return <CGV onBack={onBack} />;
  if (page === 'mentions') return <MentionsLegales onBack={onBack} />;
  return null;
}
