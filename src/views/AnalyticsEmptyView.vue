<template>
  <DashboardLayout active-menu-item="insights" background-color="white" no-content-padding @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex h-full">
        <div class="flex-1 m-10 rounded-[40px] bg-om-peach-50 flex items-center justify-center gap-16 px-16 py-16 overflow-hidden">

          <!-- Left: Text content -->
          <div class="max-w-sm w-full shrink-0">
            <h1 class="text-4xl font-bold text-om-gray-700 mb-4 leading-tight">Analyze your campaign performance</h1>
            <p class="text-base text-om-gray-500 mb-6 leading-relaxed">
              See how much revenue or other conversions your campaigns have generated.
            </p>
            <a href="#" class="text-om-orange-500 font-medium text-sm flex items-center gap-1 hover:underline">
              Learn more
              <span class="text-base">›</span>
            </a>
          </div>

          <!-- Right: Skeleton chart illustration -->
          <div class="flex-1 min-w-0 pointer-events-none select-none relative overflow-hidden bg-white rounded-[28px] p-6">
            <!-- Header skeleton: dropdowns and labels -->
            <svg viewBox="0 0 800 48" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80 mb-1">
              <!-- Title text placeholder -->
              <rect x="0" y="6" width="100" height="10" rx="5" fill="#E5E7EB"/>
              <!-- Dropdown 1 -->
              <rect x="0" y="28" width="130" height="14" rx="7" fill="#F3F4F6"/>
              <!-- Dropdown 2 -->
              <rect x="140" y="28" width="110" height="14" rx="7" fill="#F3F4F6"/>
              <!-- Dropdown 3 (right side) -->
              <rect x="570" y="28" width="110" height="14" rx="7" fill="#F3F4F6"/>
              <rect x="690" y="28" width="110" height="14" rx="7" fill="#F3F4F6"/>
            </svg>

            <svg viewBox="-40 0 880 220" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80">
              <defs>
                <linearGradient id="analyticsSkeletonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E5E7EB" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#E5E7EB" stop-opacity="0.05"/>
                </linearGradient>
              </defs>
              <!-- Y-axis label placeholders -->
              <rect x="8" y="22" width="36" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="8" y="67" width="36" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="8" y="112" width="36" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="8" y="157" width="36" height="8" rx="4" fill="#E5E7EB"/>
              <!-- Grid lines -->
              <line x1="54" y1="26" x2="792" y2="26" stroke="#E5E7EB" stroke-width="1.5"/>
              <line x1="54" y1="71" x2="792" y2="71" stroke="#E5E7EB" stroke-width="1.5"/>
              <line x1="54" y1="116" x2="792" y2="116" stroke="#E5E7EB" stroke-width="1.5"/>
              <line x1="54" y1="161" x2="792" y2="161" stroke="#E5E7EB" stroke-width="1.5"/>
              <!-- Area fill -->
              <path
                d="M54,161 L54,120 C120,120 150,60 200,75 C250,90 280,45 330,55 C380,65 420,100 470,85 C520,70 560,35 610,50 C660,65 700,90 750,80 L792,75 L792,161 Z"
                fill="url(#analyticsSkeletonGrad)"
              />
              <!-- Line -->
              <path
                d="M54,120 C120,120 150,60 200,75 C250,90 280,45 330,55 C380,65 420,100 470,85 C520,70 560,35 610,50 C660,65 700,90 750,80 L792,75"
                fill="none"
                stroke="#E5E7EB"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!-- X-axis label placeholders -->
              <rect x="54"  y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="120" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="186" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="252" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="318" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="384" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="450" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="516" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="582" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="648" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="714" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="754" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            </svg>

            <!-- Table skeleton below chart -->
            <svg viewBox="0 0 800 180" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80 mt-2">
              <!-- Header row -->
              <rect x="16" y="8" width="160" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="380" y="8" width="60" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="460" y="8" width="60" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="540" y="8" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="610" y="8" width="40" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="670" y="8" width="60" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="750" y="8" width="34" height="8" rx="4" fill="#F3F4F6"/>
              <!-- Divider -->
              <line x1="0" y1="26" x2="800" y2="26" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 1 -->
              <rect x="16" y="36" width="140" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="380" y="36" width="50" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="460" y="36" width="55" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="540" y="36" width="40" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="610" y="36" width="35" height="8" rx="4" fill="#E5E7EB"/>
              <line x1="0" y1="56" x2="800" y2="56" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 2 -->
              <rect x="16" y="66" width="120" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="380" y="66" width="50" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="460" y="66" width="55" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="540" y="66" width="40" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="610" y="66" width="35" height="8" rx="4" fill="#E5E7EB"/>
              <line x1="0" y1="86" x2="800" y2="86" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 3 (sub-row indent) -->
              <rect x="36" y="96" width="100" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="380" y="96" width="50" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="460" y="96" width="55" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="540" y="96" width="40" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="610" y="96" width="35" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="670" y="96" width="50" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="750" y="96" width="34" height="7" rx="3" fill="#F3F4F6"/>
              <line x1="0" y1="114" x2="800" y2="114" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 4 (sub-row indent) -->
              <rect x="36" y="124" width="90" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="380" y="124" width="50" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="460" y="124" width="55" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="540" y="124" width="40" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="610" y="124" width="35" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="670" y="124" width="50" height="7" rx="3" fill="#F3F4F6"/>
              <rect x="750" y="124" width="34" height="7" rx="3" fill="#F3F4F6"/>
            </svg>

            <!-- Bottom fade overlay -->
            <div class="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-om-peach-50 to-transparent"></div>
          </div>

        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

defineEmits(['menu-click'])
</script>
