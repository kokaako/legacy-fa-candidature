export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return response.status(500).json({ error: "Webhook manquant" });
  }

  const body = request.body || {};

  const disponibilites = body.disponibilites || {};
  const texteDispos = [
    `Lundi : ${disponibilites.lundi || "Aucune"}`,
    `Mardi : ${disponibilites.mardi || "Aucune"}`,
    `Mercredi : ${disponibilites.mercredi || "Aucune"}`,
    `Jeudi : ${disponibilites.jeudi || "Aucune"}`,
    `Vendredi : ${disponibilites.vendredi || "Aucune"}`,
    `Samedi : ${disponibilites.samedi || "Aucune"}`,
    `Dimanche : ${disponibilites.dimanche || "Aucune"}`
  ].join("\n");

  const message = {
    username: "Candidature Staff Legacy FA",
    embeds: [{
      title: "Nouvelle candidature staff",
      color: 0x2563eb,
      fields: [
        { name: "Identifiant Discord", value: body.discordId || "Non renseigné", inline: true },
        { name: "Pseudo Discord", value: body.discordPseudo || "Non renseigné", inline: true },
        { name: "Pseudo en jeu", value: body.gamePseudo || "Non renseigné", inline: true },
        { name: "Poste souhaité", value: body.poste || "Non renseigné", inline: true },
        { name: "Âge", value: body.age || "Non renseigné", inline: true },
        { name: "Date de naissance", value: body.naissance || "Non renseignée", inline: true },
        { name: "Disponibilités", value: texteDispos },
        { name: "Expérience staff", value: body.experience || "Non renseignée" },
        { name: "Motivation", value: body.motivation || "Non renseignée" }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  const discordResponse = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });

  if (!discordResponse.ok) {
    return response.status(500).json({ error: "Erreur Discord" });
  }

  return response.status(200).json({ ok: true });
}
