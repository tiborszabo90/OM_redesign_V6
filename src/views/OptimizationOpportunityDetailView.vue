<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen" background-color="white">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">

        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <button class="back-btn" @click="$emit('go-back')">
            <ChevronLeft :size="18" />
            Back
          </button>
          <span class="text-om-gray-300">/</span>
          <span class="text-sm text-om-gray-400">Optimization Opportunities</span>
        </div>

        <!-- Title row -->
        <div class="flex items-center gap-3 mb-8">
          <h1 class="text-2xl font-semibold text-om-gray-700">{{ opportunity.name }}</h1>
          <div :class="['value-badge', `badge-${opportunity.level}`]">{{ opportunity.value }}</div>
        </div>

        <!-- Content -->
        <div class="detail-content">

          <div class="detail-section">
            <h2 class="detail-section-title">The Problem</h2>
            <p class="detail-section-text">{{ opportunity.problem }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">The Recommendation</h2>
            <p class="detail-section-text">{{ opportunity.recommendation }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Optimization Potential</h2>
            <p class="detail-section-text">{{ opportunity.potential }}</p>
          </div>

          <div class="cta-row">
            <Button size="md">{{ opportunity.cta }}</Button>
          </div>

        </div>
      </div>
    </template>

    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import Button from '../components/shared/Button.vue'

const props = defineProps({
  opportunityId: {
    type: Number,
    default: 1
  }
})

defineEmits(['menu-click', 'go-back'])

const isChatOpen = ref(true)

const chatSuggestions = [
  'How do I implement this on mobile?',
  'What OptiMonk template should I use?',
  'How quickly can I expect results?',
  'Are there similar campaigns in the library?',
]

const chatAiResponses = {
  'How do I implement this on mobile?': 'To implement this on mobile, go to **Campaigns → New Campaign** and select a mobile-optimized template. Set the display rules to target mobile devices only, then configure the trigger (e.g., back-button or scroll-up for exit-intent). I recommend starting with a full-screen or bottom-sheet format for best mobile UX.',
  'What OptiMonk template should I use?': 'For this opportunity, I\'d recommend checking the **Templates library** under the "Exit Intent" or "Abandonment" category. Filter by device type "Mobile" to narrow it down. The "Smart Discount" and "Free Shipping Bar" templates are strong starting points.',
  'How quickly can I expect results?': 'You can typically see measurable results within **7–14 days** of launching. For statistical significance in A/B tests, aim for at least 1,000 impressions per variant. Given your current traffic levels, you should have enough data within 2 weeks.',
  'Are there similar campaigns in the library?': 'Yes — search the Templates library for "abandonment" or "exit intent". You\'ll find several pre-built templates similar to what\'s recommended here. These are ready to customize with your brand colors and messaging in the editor.',
}

const allOpportunities = [
  {
    id: 1,
    name: 'Deploy Smart Abandonment Stopper on Mobile',
    value: '+2.5M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'The "PC Service Smart Abandonment Stopper" is the best-performing campaign overall (7.67% purchase rate, 13.97% submit rate, 13.89% ATC rate), but it\'s running on desktop only (2,281 visitors on desktop vs. 5 on mobile). With 130K mobile visitors, this is the single biggest missed opportunity.',
    recommendation: 'Create a mobile-optimized version of the Smart Abandonment Stopper. Mobile exit-intent can be triggered by back-button behavior, scroll-up patterns, or tab-switch detection. The message should offer the same value (likely a discount or free shipping incentive) in a mobile-friendly full-screen or bottom-sheet format.',
    potential: 'If the mobile version achieves even 50% of the desktop performance (so ~3.8% purchase rate on a fraction of abandoning mobile visitors), with even 5,000 monthly mobile impressions, this could drive ~190 additional purchases. At an average order value of ~13,500 Ft, that\'s approximately +2.5M Ft additional monthly revenue (+32% to assisted revenue).'
  },
  {
    id: 2,
    name: 'Fix the Facebook Traffic Conversion Gap',
    value: '+3.7M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'Facebook is the #1 traffic source (34,811 visitors) but converts at only 0.72% — far below olcsobbat (3.19%), Google (2.68%), or even the site average (2.17%). TikTok sends 1,207 visitors with zero purchases. Combined, social traffic accounts for ~36K visitors with extremely low conversion.',
    recommendation: 'Create a dedicated OptiMonk welcome campaign for Facebook/TikTok UTM sources. Social visitors often land cold (from discovery, not search intent), so they need more warming. Implement a "social welcome" popup or embedded bar that provides social proof, bestseller recommendations, or a first-order incentive specifically for social visitors. Also review whether Facebook ad landing pages match the ad promise — the current Valentine\'s Day page had 2,161 visitors but only 0.28% conversion.',
    potential: 'Lifting Facebook traffic conversion from 0.72% to just 1.5% (still below site average) would generate ~272 additional purchases per month. At 13,500 Ft AOV: ~3.7M Ft additional monthly revenue.'
  },
  {
    id: 3,
    name: 'Scale the Winning Email Subscription Variant',
    value: '+945K Ft/month',
    level: 'medium',
    cta: 'Scale winner',
    problem: 'The A/B test conclusively showed Variáns 1 (multi-step) outperforms Variáns 2 (single-page) by 70.7% (2.22% vs 0.65% submit rate, 100% chance to win). However, the losing variant is still getting 50% of traffic (34,505 visitors). Additionally, the popup\'s overall purchase rate is only 0.12% — subscribers aren\'t converting.',
    recommendation: 'Immediately stop Variáns 2 and allocate 100% traffic to the winner. Then iterate on the winning variant: test different incentive offers (the current "ajándék" gift offer could be tested against a percentage discount or free shipping threshold), optimize the post-subscription welcome flow, and add an immediate post-signup offer that drives first purchase within the session.',
    potential: 'Stopping the losing variant alone would improve lead gen from ~1,006 to ~1,400 submits/month (+39%). If a post-signup offer converts even 5% of new subscribers to immediate purchases: 70 additional orders/month = ~945K Ft additional monthly revenue, plus long-term email list value.'
  },
  {
    id: 4,
    name: 'Replace Zero-Converting Dynamic Content Campaign',
    value: '+2.3M Ft/month',
    level: 'high',
    cta: 'Replace this campaign',
    problem: 'This campaign reaches 57,315 visitors with 261,132 impressions (4.6 impressions per visitor!) but produces exactly ZERO purchases, ZERO submits, and ZERO add-to-carts. It\'s the most-shown campaign by impression count, and it appears to create no measurable value.',
    recommendation: 'Audit what this campaign actually shows visitors. If it\'s a dynamic content block (product recommendations, banners, etc.), the zero conversion rate across all goals suggests it\'s either not compelling, not relevant, or not clickable. Consider replacing it with personalized product recommendations based on browsing behavior, trending/bestseller badges, or recently-viewed product reminders. If it\'s a test that has already concluded, deactivate it to reduce page bloat.',
    potential: 'Replacing this with a well-targeted embedded recommendation engine reaching even a fraction of those 57K visitors could deliver a 0.5–1% conversion lift. Even at 0.3% purchase rate: 171 additional purchases = ~2.3M Ft additional monthly revenue.'
  },
  {
    id: 5,
    name: 'Build a Mobile-First Cart Abandonment Flow',
    value: '+3.0M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'The cart page (shop_cart.php) gets 32,894 pageviews from 7,231 visitors, but the 38.53% purchase rate means 61.47% of cart visitors (4,446 people) leave without buying. Given that 76% of traffic is mobile and mobile converts 37% worse than desktop, the majority of cart abandonments are happening on mobile. The current abandonment stopper essentially doesn\'t serve mobile users.',
    recommendation: 'Create a multi-step mobile cart recovery system: (1) an in-session urgency/benefit reminder when users show intent to leave the cart (e.g., "Ingyenes szállítás 15.000 Ft felett!" or stock scarcity), (2) an exit-intent popup offering to save their cart via email, and (3) a post-session browse abandonment email triggered by ActiveCampaign/TheMarketer. Consider also a sticky mobile cart summary bar that follows users to reduce friction.',
    potential: 'Recovering even 5% of the ~4,446 monthly cart abandoners would yield ~222 additional purchases = ~3.0M Ft additional monthly revenue.'
  },
  {
    id: 6,
    name: 'Enhance the Funko Upsell/Cross-sell Campaign',
    value: '+435K Ft/month',
    level: 'medium',
    cta: 'Improve campaign',
    problem: 'The "funko upsell" campaign is underperforming significantly: only 1,418 visitors, 1,571 impressions, 2 purchases (0.14%), and 5 add-to-carts (0.35%). Meanwhile, the Funko POP category gets 8,880 pageviews from 4,436 visitors with only 4.55% purchase rate — notably below the board game category (7.10%). Funko collectors are a high-frequency purchase audience being underserved.',
    recommendation: 'Redesign the Funko upsell as a "Complete Your Collection" or "Más is érdekelheti" recommendation engine. Funko collectors typically buy in sets or by franchise — leverage franchise-based cross-sells (e.g., show all Marvel Funkos when someone views one). Add urgency with "Limitált készlet" (limited stock) messaging for exclusive figures. Also consider a Funko-specific popup for the collector audience offering new arrival notifications.',
    potential: 'Lifting the Funko category purchase rate from 4.55% to 6.5% (closer to the Társasjátékok rate) would mean ~87 additional purchases/month from this category alone. At typical Funko AOV of ~5,000 Ft: ~435K Ft additional monthly revenue, plus higher frequency from collector re-engagement.'
  },
  {
    id: 7,
    name: 'Implement Search-to-Purchase Optimization',
    value: '+3.7M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'The search page is the most visited page (81,574 pageviews, 17,761 visitors) with a solid 6.94% purchase rate. Searchers are high-intent visitors, but 93% still leave without buying. The current search experience shows results with basic sorting and filters, but lacks personalization, upsell opportunities, or "no results" recovery.',
    recommendation: 'Add an OptiMonk embedded campaign specifically on search result pages that shows: (1) trending searches / popular products when results are few or zero, (2) a "Nem találod amit keresel?" (Can\'t find what you\'re looking for?) helper popup after a visitor performs multiple searches, (3) cross-category suggestions ("Catan" searchers might also like other strategy games). Also consider adding a "search exit" popup with a discount code for searchers who searched but didn\'t add to cart.',
    potential: 'Improving search conversion from 6.94% to 8.5% would yield ~277 additional purchases/month from 17,761 search visitors. At 13,500 Ft AOV: ~3.7M Ft additional monthly revenue.'
  },
  {
    id: 8,
    name: 'Create a Seasonal/Valentine\'s Day Urgency Campaign',
    value: '2-4M Ft/year',
    level: 'medium',
    cta: 'Create campaign',
    problem: 'The Valentine\'s Day landing page (/valentin-nap) drew 2,161 visitors but converted at only 0.28% — dramatically below the site average. This is a well-curated page with 279 gift products in relevant subcategories, yet almost nobody buys. There\'s no urgency, no gift-giving guidance, and no special incentive visible.',
    recommendation: 'For Valentine\'s Day (and all seasonal campaigns), layer urgency and gift-giving confidence: (1) countdown timer to guaranteed delivery date ("Rendeld meg ma, és megkapod Valentin-napra!"), (2) gift recommendation quiz popup ("Kinek keresel ajándékot? → Partner / Barát / Családtag"), (3) gift wrapping upsell, (4) social proof specific to the occasion ("1,200+ Valentin-napi ajándék eladva az idén"). This approach should be templated for all seasonal events (Karácsony, Black Friday, iskolakezdés).',
    potential: 'Lifting Valentine\'s conversion from 0.28% to even 2% (still below site average) on 2,161 visitors = ~37 additional purchases. At a potentially higher gift AOV of ~15,000 Ft: ~555K Ft additional revenue during the campaign period. Scaled across all seasonal campaigns: 2-4M Ft annual impact.'
  },
  {
    id: 9,
    name: 'Launch a "Vásárlói Klub" Conversion Popup',
    value: '+4.6M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'The homepage prominently features the "Reflexshop Vásárlói Klub" offering 7% fixed discount. On product pages, there\'s a yellow banner promoting the club benefit. However, there\'s no OptiMonk campaign specifically designed to convert browsing visitors into club members. The current newsletter footer form has no incentive beyond "stay informed." The newsletter and the Club seem to be separate funnels that could be unified.',
    recommendation: 'Create a high-converting "Join the Club" popup that appears after a visitor has viewed 2+ products or spent 60+ seconds on site. The message should lead with the tangible benefit: "Legyél Klubtag és kapsz 7% kedvezményt MOST az első rendelésedre!" Use a multi-step form (email → name → preferences) following the proven Variáns 1 approach. Segment by product interest to personalize the club value proposition (Funko collector alerts vs. board game new release notifications).',
    potential: 'If this converts 2% of the ~170K monthly visitors who are not yet members, that\'s 3,400 new club members/month. If 10% of new members make a purchase within 30 days at 13,500 Ft AOV: 340 purchases = ~4.6M Ft additional monthly revenue, with compounding LTV value from the 7% loyalty discount driving repeat purchases.'
  },
  {
    id: 10,
    name: 'Improve the olcsobbat/Price Comparison Visitor Experience',
    value: '+2.9M Ft/month',
    level: 'high',
    cta: 'Create campaign',
    problem: 'Olcsobbat (price comparison) drives 26,671 visitors with the highest purchase rate among large traffic sources (3.19%, 852 purchases). These visitors are price-sensitive and comparison-shopping. However, there\'s no dedicated campaign for these visitors despite them being the most valuable paid source. Similarly, the Google Shopping source (365 visitors, 0.82%) underperforms.',
    recommendation: 'Create a targeted OptiMonk campaign for visitors arriving from price comparison sites (olcsobbat UTM) that reinforces why Reflexshop is the best choice beyond price: (1) "Miért a Reflexshop?" trust bar showing free shipping threshold, return policy, physical stores, 25 years in business, (2) price-match guarantee messaging, (3) club membership promotion (additional 7% off), (4) "Raktáron — azonnali szállítás" (In stock — immediate shipping) prominence. For Google Shopping visitors, add a similar trust-building embedded widget.',
    potential: 'Lifting olcsobbat conversion from 3.19% to 4% (achievable given the proven intent of these visitors) = ~216 additional purchases/month. At 13,500 Ft AOV: ~2.9M Ft additional monthly revenue.'
  }
]

const opportunity = computed(() => allOpportunities.find(o => o.id === props.opportunityId) || allOpportunities[0])
</script>

<style scoped>
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.back-btn:hover {
  color: #23262A;
  background: #F1F2F4;
}

.value-badge {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}

.badge-high {
  background: #FFF0EB;
  color: #C94B14;
}

.badge-medium {
  background: #FFF8E6;
  color: #9A6400;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 720px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  margin: 0;
}

.detail-section-text {
  font-size: 0.9375rem;
  color: #4B5563;
  line-height: 1.7;
  margin: 0;
}

.cta-row {
  padding-top: 8px;
}
</style>
