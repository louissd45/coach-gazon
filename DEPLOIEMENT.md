# Déployer Coach Gazon sur Vercel

Ce guide suppose que Supabase est déjà configuré (migrations appliquées,
Edge Functions déployées, secrets définis — voir README.md).

## Étape 1 : Initialiser Git

Ouvrez un terminal dans le dossier `coach-gazon` et lancez :

```bash
git init
git add .
git commit -m "Coach Gazon - version initiale"
```

Le fichier `.gitignore` est déjà configuré pour exclure `.env.local`
(vos clés ne partiront jamais sur GitHub).

## Étape 2 : Créer le repo GitHub

1. Allez sur github.com, cliquez sur **New repository**
2. Nommez-le `coach-gazon`, laissez-le vide (pas de README/licence)
3. Copiez les commandes affichées par GitHub, du type :

```bash
git remote add origin https://github.com/<votre-pseudo>/coach-gazon.git
git branch -M main
git push -u origin main
```

## Étape 3 : Connecter à Vercel

1. Allez sur vercel.com, connectez-vous (ou créez un compte, gratuit)
2. **Add New > Project**
3. Sélectionnez le repo `coach-gazon` dans la liste

Vercel détecte automatiquement Vite. Vérifiez juste que ces valeurs
sont bien pré-remplies :

| Paramètre | Valeur |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

## Étape 4 : Variables d'environnement

**Avant de cliquer sur Deploy**, ouvrez la section **Environment
Variables** et ajoutez ces deux lignes (récupérées dans Supabase >
Project Settings > API) :

| Nom | Valeur |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | votre clé `anon public` |

N'ajoutez rien d'autre ici : les clés OpenAI, Stripe et Twilio restent
exclusivement dans les secrets Supabase Edge Functions, jamais dans
Vercel.

## Étape 5 : Déployer

Cliquez sur **Deploy**. Après 1 à 2 minutes, vous obtenez une URL du
type `coach-gazon.vercel.app`.

## Étape 6 : Mettre à jour `APP_URL` côté Supabase

Une fois l'URL Vercel connue, mettez à jour le secret utilisé par
Stripe pour les redirections après paiement :

```bash
supabase secrets set APP_URL=https://coach-gazon.vercel.app
```

(remplacez par votre propre domaine si vous en branchez un ensuite)

## Et après ?

Chaque `git push` sur la branche `main` redéploie automatiquement.
Vous n'avez plus jamais besoin de revenir manuellement dans Vercel
pour publier une mise à jour.

## Checklist avant ouverture au public

- [ ] Compte Stripe en mode live (pas test) avec le bon prix 49€/an
- [ ] Compte Twilio avec numéro d'envoi actif et crédit suffisant
- [ ] Limite de dépense définie sur le compte OpenAI
- [ ] Catalogue produits rempli avec vos vrais liens (table `produits`)
- [ ] Mention légale et politique de confidentialité ajoutées (RGPD)
- [ ] Test complet : inscription → abonnement → upload photo → SMS
