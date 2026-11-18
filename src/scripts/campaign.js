const campaignFields = [
  { query: 'utm_source', field: 'utmSource', maxLength: 120 },
  { query: 'utm_medium', field: 'utmMedium', maxLength: 120 },
  { query: 'utm_campaign', field: 'utmCampaign', maxLength: 160 },
];

function campaignValues(params) {
  return campaignFields.flatMap(({ query, field, maxLength }) => {
    const value = params.get(query)?.trim().slice(0, maxLength);
    return value ? [{ query, field, value }] : [];
  });
}

export function campaignForLead(params) {
  return Object.fromEntries(campaignValues(params).map(({ field, value }) => [field, value]));
}

export function preserveCampaignLinks(page, links) {
  const campaign = campaignValues(page.searchParams);
  if (!campaign.length) return;

  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.hasAttribute('download')) continue;

    const target = new URL(link.href);
    if (target.origin !== page.origin || target.protocol !== page.protocol) continue;
    if (campaignFields.some(({ query }) => target.searchParams.has(query))) continue;

    for (const { query, value } of campaign) target.searchParams.set(query, value);
    link.href = target.pathname + target.search + target.hash;
  }
}
