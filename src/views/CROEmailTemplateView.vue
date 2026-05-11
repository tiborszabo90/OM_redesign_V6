<template>
  <div class="email-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <button class="toolbar-btn" @click="$emit('go-back')">
        <ChevronLeft :size="16" /> Back
      </button>
      <div class="toolbar-meta">
        <span><strong>Subject:</strong> Your CRO insights for {{ domain }} are ready</span>
      </div>
    </div>

    <!-- Email body preview -->
    <div class="email-frame">
      <div ref="emailBodyRef" class="email-body" v-html="emailHtml" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { croInsights } from '../data/croInsights.js'

defineEmits(['go-back'])

const emailBodyRef = ref(null)
const domain = 'reflexshop.hu'
const reportUrl = 'https://app.optimonk.com/insights'
const insightUrl = (id) => `https://app.optimonk.com/insights/${id}`

const impactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }

const counts = computed(() => {
  const byValue = croInsights.reduce((acc, i) => {
    acc[i.value] = (acc[i.value] || 0) + 1
    return acc
  }, {})
  const campaignSet = new Set(croInsights.map(i => i.campaign))
  return {
    total: croInsights.length,
    campaigns: campaignSet.size,
    large: byValue['Large'] || 0,
    mediumLarge: byValue['Medium to large'] || 0,
    medium: byValue['Medium'] || 0,
    smallMedium: byValue['Small to medium'] || 0,
    newIdeas: croInsights.filter(i => i.campaign === 'New campaign idea').length,
  }
})

const topInsights = computed(() => {
  return [...croInsights]
    .sort((a, b) => (impactPriority[b.value] ?? 0) - (impactPriority[a.value] ?? 0) || a.id - b.id)
    .slice(0, 5)
})

const campaignSummaries = computed(() => {
  const byCampaign = new Map()
  for (const insight of croInsights) {
    if (!byCampaign.has(insight.campaign)) byCampaign.set(insight.campaign, [])
    byCampaign.get(insight.campaign).push(insight)
  }
  const result = []
  for (const [campaign, insights] of byCampaign.entries()) {
    insights.sort((a, b) => a.id - b.id)
    const top = insights.reduce((best, i) => (impactPriority[i.value] ?? 0) > (impactPriority[best.value] ?? 0) ? i : best, insights[0])
    result.push({ campaign, count: insights.length, topImpact: top.value, firstId: insights[0].id })
  }
  return result.sort((a, b) => a.firstId - b.firstId)
})

const badgeColor = (value) => {
  if (value === 'Large' || value === 'Medium to large') return { bg: '#FFF0EB', color: '#C94B14' }
  if (value === 'Medium') return { bg: '#FFF8E6', color: '#9A6400' }
  return { bg: '#F1F2F4', color: '#6B7280' }
}

const emailHtml = computed(() => {
  const accentOrange = '#ED5A29'
  const textPrimary = '#23262A'
  const textSecondary = '#3F4248'
  const textMuted = '#6B7280'
  const borderColor = '#ECEEF1'
  const footerBg = '#F5F6F8'

  const fontStack = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`

  const topInsightsHtml = topInsights.value.map((insight, idx) => {
    const c = badgeColor(insight.value)
    const divider = idx === 0 ? '' : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-top:1px solid ${borderColor};line-height:0;font-size:0;height:1px;">&nbsp;</td>
      </tr>
    </table>
    `
    const cardMarginTop = idx === 0 ? 'margin-top:24px;' : ''
    return `
    ${divider}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${cardMarginTop}">
      <tr>
        <td valign="top" style="width:4px;background:${accentOrange};line-height:0;font-size:0;border-radius:2px;">&nbsp;</td>
        <td valign="top" style="padding:0 0 0 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;">
            <tr>
              <td valign="top" style="font-size:16px;font-weight:600;color:${textPrimary};line-height:1.5;padding-right:12px;font-family:${fontStack};">${insight.name}</td>
              <td valign="top" align="right" style="white-space:nowrap;">
                <span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 12px;border-radius:999px;background:${c.bg};color:${c.color};font-family:${fontStack};">${insight.value} impact</span>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 12px;font-size:13px;color:${textSecondary};line-height:1.6;font-family:${fontStack};">
            <strong style="color:${textPrimary};font-weight:600;">Campaign:</strong> ${insight.campaign}
          </p>
          <p style="margin:0 0 12px;font-size:14px;color:${textSecondary};line-height:1.6;font-family:${fontStack};">${insight.description}</p>
          <a href="${insightUrl(insight.id)}" style="display:inline-block;font-size:13px;font-weight:600;color:${accentOrange};text-decoration:none;font-family:${fontStack};">View insight details &rarr;</a>
        </td>
      </tr>
    </table>
    `
  }).join('')

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Your CRO insights for ${domain}</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${textPrimary};">
  <div style="display:none;font-size:1px;color:#FFFFFF;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your CRO agent analyzed ${domain} and surfaced ${counts.value.total} opportunities across ${counts.value.campaigns} campaigns.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FFFFFF;">

          <!-- Top orange strip -->
          <tr>
            <td style="background:${accentOrange};line-height:1px;font-size:1px;height:8px;">&nbsp;</td>
          </tr>

          <!-- Header with logo -->
          <tr>
            <td style="padding:32px 40px 22px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:14px;">
                    <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                      <path d="M38.1753 13.7593V14.3973L37.5232 30.9868C37.4859 32.5543 36.8933 34.0604 35.8466 35.2476C34.7999 36.4347 33.3643 37.2292 31.7852 37.495L34.263 41.7062C36.3992 41.4111 38.363 40.3954 39.8154 38.8344C41.2679 37.2733 42.1176 35.265 42.218 33.1562L43.0004 11.4623V10.8242L38.1753 13.7593Z" fill="#23262A"/>
                      <circle cx="27.0911" cy="29.7137" r="2.4778" fill="#ED5A29"/>
                      <circle cx="18.4856" cy="29.7137" r="2.4778" fill="#ED5A29"/>
                      <circle cx="27.0911" cy="22.1941" r="2.4778" fill="#ED5A29"/>
                      <circle cx="18.4856" cy="22.1941" r="2.4778" fill="#ED5A29"/>
                      <circle cx="27.0911" cy="14.659" r="2.4778" fill="#ED5A29"/>
                      <circle cx="18.4856" cy="14.659" r="2.4778" fill="#ED5A29"/>
                      <path d="M31.1327 37.6244L15.4834 38.5177C13.6708 38.6231 11.8885 38.0263 10.522 36.8562C9.15541 35.6861 8.3143 34.0368 8.18045 32.2648L6.74594 13.8887C6.62908 12.9221 6.73098 11.9421 7.04442 11.0183C7.35785 10.0945 7.87515 9.24949 8.55962 8.54318C9.24409 7.83686 10.079 7.28655 11.0051 6.93125C11.9312 6.57596 12.9258 6.42439 13.9185 6.48729L31.6543 7.25295C33.3646 7.3749 34.9706 8.10332 36.1711 9.30154C37.3716 10.4998 38.0841 12.0855 38.1748 13.7611L43 10.8261C42.9673 8.5565 42.0403 6.38693 40.4123 4.77009C38.7843 3.15326 36.5811 2.21407 34.2625 2.1485L10.6582 1H9.87578C8.63625 1.04821 7.41926 1.33966 6.29707 1.85704C5.17489 2.37442 4.17038 3.10719 3.34322 4.01182C2.51606 4.91646 1.88309 5.97452 1.48192 7.12318C1.08075 8.27183 0.919544 9.48766 1.00788 10.6985L2.96404 34.6894C3.13156 37.0372 4.23917 39.2254 6.04617 40.7786C7.85317 42.3317 10.2136 43.1243 12.6144 42.9841L33.6105 41.708H34.2625L31.7847 37.4968L31.1327 37.6244Z" fill="#ED5A29"/>
                    </svg>
                  </td>
                  <td valign="middle" style="font-size:30px;font-weight:700;color:${textPrimary};letter-spacing:-0.02em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    OptiMonk
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid ${borderColor};line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px 4px;">
              <p style="margin:0 0 18px;font-size:16px;color:${textPrimary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Hi Teszt,</p>
              <p style="margin:0 0 18px;font-size:16px;color:${textPrimary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Good news! Your CRO agent just finished a fresh review of <strong>${domain}</strong> and surfaced <strong>${counts.value.total} opportunities</strong> across <strong>${counts.value.campaigns} campaigns</strong>.
              </p>
              <p style="margin:0 0 18px;font-size:16px;color:${textPrimary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <strong>Here's the gist:</strong> ${counts.value.large} Large-impact opportunities and ${counts.value.mediumLarge} Medium-to-large ones in your existing campaigns — plus ${counts.value.newIdeas} brand-new campaign ideas for traffic you're not yet reaching. Each one comes with the evidence behind it and a short validation plan, so you can decide what's worth testing before you build anything.
              </p>
            </td>
          </tr>

          <!-- Top opportunities heading -->
          <tr>
            <td style="padding:18px 40px 0;">
              <h2 style="margin:0;font-size:20px;font-weight:700;color:${textPrimary};line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Top opportunities to look at first 👇</h2>
              <p style="margin:8px 0 0;font-size:15px;color:${textSecondary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Here are the five highest-impact ones from this batch:</p>
              ${topInsightsHtml}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:32px 40px 8px;">
              <a href="${reportUrl}" style="display:inline-block;background:${accentOrange};color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Open the full report</a>
            </td>
          </tr>

          <!-- Any questions -->
          <tr>
            <td style="padding:28px 40px 0;">
              <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${textPrimary};line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Any questions?</h3>
              <p style="margin:0;font-size:16px;color:${textPrimary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">We're here to help! Feel free to reply to this email.</p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0;font-size:16px;color:${textPrimary};line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Cheers,<br>
                The OptiMonk team 🌟
              </p>
            </td>
          </tr>

          <!-- Centered footer -->
          <tr>
            <td align="center" style="padding:18px 40px 28px;">
              <p style="margin:0 0 6px;font-size:13px;color:${textPrimary};font-style:italic;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Copyright (C) 2026 * All rights reserved.</p>
              <p style="margin:0;font-size:13px;color:${textPrimary};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <a href="mailto:support@optimonk.com" style="color:${accentOrange};text-decoration:underline;">support@optimonk.com</a>
                <span style="color:${textMuted};"> | </span>
                <a href="https://www.optimonk.com" style="color:${accentOrange};text-decoration:underline;">www.optimonk.com</a>
              </p>
            </td>
          </tr>

          <!-- Bottom support strip -->
          <tr>
            <td align="center" style="background:${footerBg};padding:16px 16px;">
              <p style="margin:0;font-size:12px;color:${textMuted};line-height:1.5;white-space:nowrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                In case you would like to contact customer service please email us at: <a href="mailto:support@optimonk.com" style="color:${accentOrange};text-decoration:underline;">support@optimonk.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
})

</script>

<style scoped>
.email-page {
  min-height: 100vh;
  background: #E5E7EB;
  display: flex;
  flex-direction: column;
}

.toolbar {
  background: white;
  border-bottom: 1px solid #ECEEF1;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6B7280;
  background: white;
  border: 1px solid #E5E7EB;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #F9FAFB;
  color: #23262A;
  border-color: #D1D5DB;
}

.toolbar-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.75rem;
  color: #6B7280;
  min-width: 0;
}

.toolbar-meta span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-frame {
  flex: 1;
  padding: 24px 12px;
  overflow-y: auto;
}

.email-body {
  max-width: 664px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.email-body :deep(*) {
  box-sizing: border-box;
}
</style>
