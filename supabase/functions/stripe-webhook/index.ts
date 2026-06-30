// supabase/functions/stripe-webhook/index.ts
//
// Reçoit les événements Stripe et met à jour la table `subscriptions`.
// C'est la SEULE source de vérité pour activer/désactiver un abonnement
// (jamais depuis le frontend, pour éviter qu'un utilisateur ne se
// déclare abonné sans avoir payé).
//
// Déploiement : supabase functions deploy stripe-webhook --no-verify-jwt
// (--no-verify-jwt est nécessaire car Stripe n'envoie pas de JWT Supabase)
//
// Configuration côté Stripe Dashboard > Developers > Webhooks :
//   URL : https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//   Événements à écouter : checkout.session.completed,
//     customer.subscription.updated, customer.subscription.deleted
//
// Secret requis :
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import Stripe from 'https://esm.sh/stripe@16.8.0?target=deno';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Signature invalide: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await upsertSubscription(userId, session.customer as string, subscription);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
        if (!userId) break;

        await upsertSubscription(userId, subscription.customer as string, subscription);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur traitement webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

async function upsertSubscription(
  userId: string,
  customerId: string,
  subscription: Stripe.Subscription
) {
  const statusMap: Record<string, string> = {
    active: 'active',
    trialing: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
    incomplete_expired: 'canceled',
  };

  await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: statusMap[subscription.status] ?? 'inactive',
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}
