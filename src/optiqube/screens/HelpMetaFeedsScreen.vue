<script setup>
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { navigate } from '../store'

const DEFINITIONS = [
  {
    term: 'Main feed',
    body: 'Your whole shop catalog — every connected product with its original photo and full details (title, price, link, availability), not just the ones this campaign generated images for. Use it to create a catalog when the shop has none on Meta yet. Google Shopping XML (RSS 2.0), the format Google Merchant Center reads too.',
  },
  {
    term: 'Supplementary feed (one per style)',
    body: "Only the product id and the AI image for that style, plus custom_label_1 = the style's name. Added on top of a catalog, it replaces the image of each product it names — this campaign's approved ones — and leaves every other product on its own photo. Offered as XML and as CSV.",
  },
  {
    term: 'Style feed (Full)',
    body: "The style's own full feed: like the main feed, but with the AI image as the product image. A catalog fed by this alone shows the styled images without any supplementary step.",
  },
]

const SYNC_NOTES = [
  'Feeds are built live from this campaign: an image you approve joins on Meta\'s next pull, a creative you hide or exclude leaves the same way. Nothing to re-export.',
  'Request update now on the data source in Commerce Manager forces a pull instead of waiting for the hour.',
  'The URLs are stable for this campaign. Regenerating images or renaming the campaign does not change them.',
]

const TROUBLE = [
  {
    lead: 'Images did not change',
    body: "the priority step is missing, or the ids differ. Run Check which id matches on the Feeds tab: it counts how many of our ids exist in your catalog's feed under each choice, and offers the switch when the other one wins.",
  },
  {
    lead: '“no content id provided”',
    body: "in Meta's error report — Meta's supplementary ingestion could not read the XML item ids. Use the CSV URL for the supplementary feed; keep XML for Google Merchant Center.",
  },
  {
    lead: 'Products rejected',
    body: 'in Diagnostics — Meta wants a price with a currency and a stock state. Products the shop feed leaves those out for are skipped here as well, and the Feeds tab counts what actually ships.',
  },
]
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">Help</p>
    <h1 class="mt-1 text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">
      Run your images as Meta catalog ads — by hand
    </h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
      Every campaign hands out product feeds under its <strong>Feeds</strong> tab. Paste those
      URLs into Meta Commerce Manager once; Meta then re-reads them on its own schedule, so
      newly approved images reach your ads without another visit here.
    </p>
    <p class="mt-2 text-sm" :style="{ color: BRAND.gray600 }">
      <button type="button" class="underline" :style="{ color: BRAND.blue }" @click="navigate('/campaigns')">
        Open your campaigns
      </button>
      → pick one → <strong>Feeds</strong>.
    </p>

    <section
      class="mt-6 max-w-3xl rounded-2xl border p-6"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
    >
      <h2 class="text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">
        What the two feeds are
      </h2>
      <div class="mt-3">
        <div v-for="d in DEFINITIONS" :key="d.term" class="mt-3 first:mt-0">
          <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">{{ d.term }}</p>
          <p class="mt-0.5 text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">{{ d.body }}</p>
        </div>
      </div>
    </section>

    <section
      class="mt-6 max-w-3xl rounded-2xl border p-6"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
    >
      <h2 class="text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">
        Keeping it in sync
      </h2>
      <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm" :style="{ color: BRAND.gray600 }">
        <li v-for="note in SYNC_NOTES" :key="note">{{ note }}</li>
      </ul>
    </section>

    <section
      class="mt-6 max-w-3xl rounded-2xl border p-6"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
    >
      <h2 class="text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">
        If something is off
      </h2>
      <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm" :style="{ color: BRAND.gray600 }">
        <li v-for="t in TROUBLE" :key="t.lead">
          <strong>{{ t.lead }}</strong> — {{ t.body }}
        </li>
      </ul>
    </section>
  </div>
</template>
