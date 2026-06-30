# Coach Gazon

## Démarrage

```bash
npm install
cp .env.local.example .env.local   # puis renseignez vos clés Supabase
npm run dev
```

## Mise en place de l'abonnement Stripe

1. Créez un compte sur stripe.com, puis dans Catalogue de produits :
   créez un produit "Coach Gazon" avec un prix récurrent de 49€/an.
   Copiez l'identifiant `price_...`.
2. Déployez les fonctions de facturation :
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```
3. Configurez les secrets :
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set STRIPE_PRICE_ID=price_...
   supabase secrets set APP_URL=https://coachgazon.fr
   ```
4. Dans le dashboard Stripe > Developers > Webhooks, ajoutez un
   endpoint pointant vers
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`,
   en écoutant `checkout.session.completed`,
   `customer.subscription.updated` et `customer.subscription.deleted`.
   Copiez le secret de signature généré :
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Testez en mode test Stripe (clé `sk_test_...`) avec la carte
   `4242 4242 4242 4242` avant de basculer en clé live.

## Mise en place Supabase

1. Créez un projet sur supabase.com
2. Appliquez les migrations :
   ```bash
   supabase link --project-ref <votre-ref>
   supabase db push
   ```
3. Importez la base de connaissances :
   ```bash
   SUPABASE_URL=https://xxx.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
   npm run import-fiches
   ```
4. Déployez les Edge Functions :
   ```bash
   supabase functions deploy analyze-lawn
   supabase functions deploy daily-check
   supabase secrets set OPENAI_API_KEY=sk-votre-cle
   supabase secrets set TWILIO_ACCOUNT_SID=ACxxxx
   supabase secrets set TWILIO_AUTH_TOKEN=xxxx
   supabase secrets set TWILIO_FROM_NUMBER=+33xxxxxxxxx
   ```
5. Planifiez l'exécution quotidienne du coach SMS : dans le dashboard
   Supabase > Database > Cron Jobs, créez une tâche qui appelle
   `daily-check` chaque jour (ex: 7h du matin). Le SQL équivalent est
   commenté en bas de `supabase/migrations/002_users_profile_and_sms.sql`.

## Fonctionnalités

- **Authentification** (`AuthForm`) : inscription/connexion email + mot
  de passe via Supabase Auth.
- **Profil utilisateur** (`ProfileForm`) : téléphone, ville (géocodée
  automatiquement via Open-Meteo) et consentement SMS.
- **Diagnostic IA** : upload photo -> Edge Function `analyze-lawn` ->
  GPT-4o avec la base de connaissances en contexte -> résultat structuré.
- **Historique** (`DiagnosticHistory`) : tous les diagnostics passés de
  l'utilisateur connecté.
- **Abonnement annuel** (`Paywall`, `useSubscription`) : 49€/an via
  Stripe Checkout. L'accès au diagnostic et à l'historique est bloqué
  tant que l'abonnement n'est pas actif. Le statut est mis à jour
  exclusivement par le webhook Stripe côté serveur (jamais modifiable
  depuis le client).
- **Suggestions produits** (`ProductSuggestion`, `produits`) : chaque
  action du diagnostic est associée à une catégorie de produit
  (engrais, scarificateur, semences...). Si un produit actif existe
  dans votre catalogue pour cette catégorie, un lien d'achat (Amazon,
  votre boutique) s'affiche directement sous l'action concernée.
- **Coach SMS autonome** (`daily-check`) :
  - Rappels d'engrais basés sur l'agenda mensuel (mars, mai, septembre)
  - Alertes canicule basées sur la météo réelle (Open-Meteo, sans clé
    API requise), avec conseil d'arrosage calibré selon la température
  - Anti-doublon via `sms_log` (un type d'alerte n'est jamais renvoyé
    deux fois dans la même fenêtre)

## Sécurité

- La clé OpenAI et les identifiants Twilio ne vivent que côté serveur
  (secrets Edge Functions), jamais dans le bundle React.
- RLS activée sur `diagnostics`, `users_profile`, `sms_log` et
  `storage.objects` : chaque utilisateur n'accède qu'à ses propres
  données.
- Le consentement SMS est un champ explicite (`sms_consent`), désactivé
  par défaut. Pensez à brancher la gestion des réponses STOP côté
  Twilio (Advanced Opt-Out) pour la conformité réglementaire.

## Étapes du projet

- [x] Étape 1 : Interface d'upload
- [x] Étape 2 : Connexion IA + diagnostic
- [x] Étape 3 : Auth Supabase, historique, import de la base de connaissances
- [x] Étape 4 : Coach SMS autonome (agenda + météo + Twilio)
- [x] Étape 5 : Abonnement annuel Stripe (49€/an)
- [x] Étape 6 : Suggestions produits avec liens d'achat (Amazon/boutique)

## Gérer votre catalogue produits

Le catalogue se trouve dans la table `produits` (voir migration
`004_produits.sql`, qui contient des exemples à remplacer). Pour
ajouter/modifier vos produits, le plus simple est de passer par
**Table Editor** dans le dashboard Supabase, ou par SQL :

```sql
insert into produits (nom, categorie, prix, lien_externe) values
  ('Votre engrais', 'engrais_azote', 24.90, 'https://amazon.fr/votre-lien');
```

Catégories disponibles (doivent correspondre exactement, c'est ce que
GPT-4o utilise pour matcher) :
`engrais_azote`, `engrais_equilibre`, `engrais_automne`, `fongicide`,
`scarificateur`, `aerateur`, `semences`, `arrosage`, `chaux`,
`desherbant`.

Si vous êtes en programme Amazon Associates, ajoutez votre tag
d'affiliation directement dans chaque `lien_externe` (ex:
`?tag=coachgazon-21`) pour toucher une commission en plus de votre
marge produit le cas échéant.

## Pistes d'évolution

- Croiser le diagnostic le plus récent avec l'agenda pour un rappel de
  suivi personnalisé ("votre fil rouge a-t-il disparu ?")
- Dashboard admin pour éditer les fiches de connaissances sans repasser
  par le fichier texte
- Notifications push en plus des SMS pour réduire les coûts Twilio
