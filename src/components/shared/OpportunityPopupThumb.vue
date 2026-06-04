<template>
  <div class="bg-white border border-om-gray-200 rounded-xl overflow-hidden w-full h-full relative">

    <!-- Discount: image left, content right -->
    <template v-if="variant === 'discount'">
      <div class="flex h-full">
        <div class="w-1/2 shrink-0 bg-om-gray-100 overflow-hidden flex items-center justify-center">
          <img src="/campaigns/smart-discount-popup-img.png" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="w-1/2 px-4 py-4 flex flex-col items-center justify-center text-center">
          <img src="/demos/telekom/logo2.png" alt="" class="w-8 h-8 object-contain mb-2" />
          <h4 class="text-[15px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
            Get 10% OFF!
          </h4>
          <p class="text-[10px] text-om-gray-500 mb-2 leading-snug">
            On your first order
          </p>
          <button class="w-full py-1.5 text-white text-[10px] font-bold mb-1 rounded" :style="{ backgroundColor: brandColor }">
            CLAIM DISCOUNT
          </button>
          <button class="w-full py-1.5 text-[10px] font-bold rounded border bg-white" :style="{ color: brandColor, borderColor: brandColor }">
            NO, THANKS
          </button>
        </div>
      </div>
    </template>

    <!-- Email capture: image left, form right -->
    <template v-else-if="variant === 'email-capture'">
      <div class="flex h-full">
        <div class="w-1/2 shrink-0 overflow-hidden">
          <img src="/campaigns/cart-abandonment-stopper-img.png" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="w-1/2 px-4 py-4 flex flex-col items-center justify-center text-center">
          <h4 class="text-[15px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
            Wait! Don't go yet
          </h4>
          <p class="text-[10px] text-om-gray-500 mb-2 leading-snug">
            Get 15% off your cart
          </p>
          <div class="w-full h-7 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-1.5">
            Enter your email
          </div>
          <button class="w-full py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
            CLAIM 15% OFF
          </button>
        </div>
      </div>
    </template>

    <!-- Wheel: gamification, wheel image right -->
    <template v-else-if="variant === 'wheel'">
      <div class="flex h-full">
        <div class="w-1/2 px-4 py-4 flex flex-col items-center justify-center text-center">
          <img src="/demos/telekom/logo2.png" alt="" class="w-8 h-8 object-contain mb-2" />
          <h4 class="text-[15px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
            Spin & Win!
          </h4>
          <p class="text-[10px] text-om-gray-500 mb-2 leading-snug">
            Win up to 30% off
          </p>
          <div class="w-full h-7 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-1.5">
            Email
          </div>
          <button class="w-full py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
            SPIN NOW
          </button>
        </div>
        <div class="w-1/2 shrink-0 overflow-hidden">
          <img src="/campaigns/lucky-wheel-img.png" alt="" class="w-full h-full object-cover" />
        </div>
      </div>
    </template>

    <!-- Upsell: product image left, content right -->
    <template v-else-if="variant === 'upsell'">
      <div class="flex h-full">
        <div class="w-1/2 shrink-0 bg-om-gray-100 overflow-hidden flex items-center justify-center">
          <img src="/whisky.png" alt="" class="h-full object-contain" />
        </div>
        <div class="w-1/2 px-4 py-4 flex flex-col justify-center text-center">
          <h4 class="text-[15px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
            Add for 50% off
          </h4>
          <p class="text-[10px] text-om-gray-500 mb-2 leading-snug">
            Pairs with your order
          </p>
          <div class="flex items-baseline justify-center gap-1.5 mb-2">
            <span class="text-[15px] font-bold text-om-gray-700">$24</span>
            <span class="text-[11px] text-om-gray-400 line-through">$49</span>
          </div>
          <button class="w-full py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
            ADD TO ORDER
          </button>
        </div>
      </div>
    </template>

    <!-- Social proof: product image with badge left, review right -->
    <template v-else-if="variant === 'social-proof'">
      <div class="flex h-full">
        <div class="w-1/2 shrink-0 bg-om-gray-100 relative overflow-hidden flex items-center justify-center">
          <img src="/whisky.png" alt="" class="h-full object-contain" />
          <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" :style="{ backgroundColor: brandColor }">
            🔥 200+ today
          </div>
        </div>
        <div class="w-1/2 px-4 py-4 flex flex-col justify-center">
          <div class="flex gap-0.5 mb-1">
            <span v-for="i in 5" :key="i" class="text-[13px]" :style="{ color: brandColor }">★</span>
          </div>
          <p class="text-[13px] font-bold text-om-gray-700 mb-1 leading-tight">Premium Edition</p>
          <p class="text-[10px] text-om-gray-500 mb-2 italic leading-snug">
            "Best buy this year!" — Sarah K.
          </p>
          <button class="w-full py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
            ADD TO CART
          </button>
        </div>
      </div>
    </template>

    <!-- Welcome back: icon left, content right -->
    <template v-else-if="variant === 'welcome-back'">
      <div class="flex h-full">
        <div class="w-1/2 shrink-0 bg-om-peach-50 flex items-center justify-center">
          <div class="text-[64px]">👋</div>
        </div>
        <div class="w-1/2 px-4 py-4 flex flex-col justify-center text-center">
          <h4 class="text-[15px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
            Welcome back!
          </h4>
          <p class="text-[10px] text-om-gray-500 mb-2 leading-snug">
            Pick up where you left off
          </p>
          <button class="w-full py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </template>

    <!-- Survey: centered, no image -->
    <template v-else-if="variant === 'survey'">
      <div class="h-full px-5 py-5 flex flex-col items-center justify-center text-center">
        <img src="/demos/telekom/logo2.png" alt="" class="w-9 h-9 object-contain mb-2" />
        <h4 class="text-[16px] font-bold mb-1 leading-tight" :style="{ color: brandColor }">
          How's your experience?
        </h4>
        <p class="text-[10px] text-om-gray-500 mb-3 leading-snug">
          Help us improve
        </p>
        <div class="flex justify-center gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold"
            :style="{ borderColor: brandColor, color: brandColor }"
          >
            {{ i }}
          </div>
        </div>
      </div>
    </template>

    <!-- Countdown: timer + email, no image -->
    <template v-else-if="variant === 'countdown'">
      <div class="h-full px-5 py-4 flex flex-col items-center justify-center text-center">
        <p class="text-[9px] uppercase tracking-widest text-om-gray-400 mb-1.5 font-semibold">Ends in</p>
        <div class="flex gap-2 mb-2.5 justify-center">
          <div v-for="(t, i) in ['00','12','45']" :key="i" class="px-2.5 py-1.5 rounded text-white text-[16px] font-bold tabular-nums" :style="{ backgroundColor: brandColor }">
            {{ t }}
          </div>
        </div>
        <h4 class="text-[15px] font-bold mb-1.5 leading-tight" :style="{ color: brandColor }">
          15% OFF — Today only
        </h4>
        <div class="w-3/4 h-7 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-1.5">
          Email
        </div>
        <button class="w-3/4 py-1.5 text-white text-[10px] font-bold rounded" :style="{ backgroundColor: brandColor }">
          CLAIM 15% OFF
        </button>
      </div>
    </template>

    <!-- Sticky bar: faux page + bottom bar -->
    <template v-else-if="variant === 'sticky-bar'">
      <div class="h-full flex flex-col bg-om-gray-50">
        <div class="flex-1 p-3 flex gap-2 min-h-0">
          <div class="w-1/3 bg-om-gray-200 rounded"></div>
          <div class="flex-1 flex flex-col gap-2 min-h-0">
            <div class="h-2 bg-om-gray-300 rounded w-3/4"></div>
            <div class="h-1.5 bg-om-gray-200 rounded w-full"></div>
            <div class="h-1.5 bg-om-gray-200 rounded w-5/6"></div>
            <div class="h-1.5 bg-om-gray-200 rounded w-2/3"></div>
            <div class="mt-auto h-4 bg-om-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div class="shrink-0 px-4 py-2.5 flex items-center justify-between text-white" :style="{ backgroundColor: brandColor }">
          <p class="text-[11px] font-bold leading-tight">
            Add $20 for FREE shipping
          </p>
          <div class="h-1.5 w-16 bg-white/30 rounded-full overflow-hidden shrink-0">
            <div class="h-full bg-white w-2/3"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Shipping reassurance: checkout-style bullets, no image -->
    <template v-else>
      <div class="h-full p-4 flex flex-col gap-2 bg-om-gray-50">
        <div class="h-2 bg-om-gray-300 rounded w-1/3 mb-0.5"></div>
        <div class="flex-1 bg-white rounded-lg p-3 border border-om-gray-200 flex flex-col gap-2 justify-center">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]" :style="{ backgroundColor: brandColor }">✓</span>
            <span class="text-[11px] text-om-gray-600">Free shipping over $50</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]" :style="{ backgroundColor: brandColor }">✓</span>
            <span class="text-[11px] text-om-gray-600">30-day free returns</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]" :style="{ backgroundColor: brandColor }">✓</span>
            <span class="text-[11px] text-om-gray-600">Secure checkout</span>
          </div>
        </div>
        <button class="w-full py-1.5 text-white text-[11px] font-bold rounded shrink-0" :style="{ backgroundColor: brandColor }">
          PLACE ORDER
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'discount' },
  brandColor: { type: String, default: '#E20074' },
})
</script>
