import { ref } from 'vue'

// Module-level (singleton) state so the recents list is shared across every place
// it's rendered (the agentic home sidebar and the chat-flow sidebar stay in sync).
const conversations = ref([
  { id: 'c1', title: 'Recover abandoned carts', starred: false },
  { id: 'c2', title: 'Welcome popup headline test', starred: false },
  { id: 'c3', title: 'Email signup for new visitors', starred: false },
  { id: 'c4', title: 'Free shipping bar setup', starred: false },
  { id: 'c5', title: 'October performance review', starred: false },
  { id: 'c6', title: 'Exit-intent discount popup', starred: false },
  { id: 'c7', title: 'Mobile cart abandoners', starred: false },
  { id: 'c8', title: 'Black Friday campaign plan', starred: false },
  { id: 'c9', title: 'Newsletter signup A/B test', starred: false },
  { id: 'c10', title: 'Product page conversion audit', starred: false },
  { id: 'c11', title: 'SMS opt-in flow', starred: false },
  { id: 'c12', title: 'Returning visitor offer', starred: false },
  { id: 'c13', title: 'Checkout drop-off analysis', starred: false },
  { id: 'c14', title: 'Spin-to-win gamification', starred: false },
  { id: 'c15', title: 'Holiday gift guide popup', starred: false },
  { id: 'c16', title: 'Cross-sell on the cart page', starred: false },
  { id: 'c17', title: 'Discount code performance', starred: false },
  { id: 'c18', title: 'Q3 funnel review', starred: false },
  { id: 'c19', title: 'Sticky bar for promotions', starred: false },
  { id: 'c20', title: 'VIP early access signup', starred: false },
  { id: 'c21', title: 'Feedback survey popup', starred: false },
  { id: 'c22', title: 'Geo-targeted campaign, EU', starred: false },
  { id: 'c23', title: 'Welcome email series', starred: false },
  { id: 'c24', title: 'Upsell at checkout', starred: false },
  { id: 'c25', title: 'Bounce reduction test', starred: false },
])

export function useRecents() {
  const rename = (id, title) => {
    const c = conversations.value.find((x) => x.id === id)
    if (c && title.trim()) c.title = title.trim()
  }
  const toggleStar = (id) => {
    const c = conversations.value.find((x) => x.id === id)
    if (c) c.starred = !c.starred
  }
  const remove = (id) => {
    conversations.value = conversations.value.filter((x) => x.id !== id)
  }
  return { conversations, rename, toggleStar, remove }
}
