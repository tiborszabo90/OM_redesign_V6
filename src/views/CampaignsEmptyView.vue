<template>
  <DashboardLayout active-menu-item="campaigns" background-color="white" no-content-padding @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex h-full">
        <div class="flex-1 m-10 rounded-[40px] bg-om-peach-50 flex items-center justify-center gap-16 px-16 py-16 overflow-hidden">

          <!-- Left: Text content -->
          <div class="max-w-sm w-full shrink-0">
            <h1 class="text-4xl font-bold text-om-gray-700 mb-4 leading-tight">Campaign List</h1>
            <p class="text-base text-om-gray-500 mb-8 leading-relaxed">
              Here you can manage your campaigns and see the most important statistics.
            </p>
            <Button variant="primary" size="lg">Create your first campaign</Button>
          </div>

          <!-- Right: Static campaigns list preview (non-interactive) -->
          <div class="flex-1 min-w-0 pointer-events-none select-none relative overflow-hidden bg-white rounded-[28px] p-8">
            <!-- Campaign rows -->
            <div class="space-y-2.5">
              <!-- Row 1: Discount popup (centered modal) -->
              <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-[0_1px_2px_1px_rgb(0_0_0/0.04)]">
                <div class="w-24 h-16 rounded-lg shrink-0 bg-om-gray-100 relative overflow-hidden border border-om-gray-100">
                  <!-- Modal popup -->
                  <div class="absolute inset-x-2 inset-y-1.5 bg-white rounded-md flex flex-col items-center justify-center gap-1 overflow-hidden px-1">
                    <div class="h-1 bg-om-gray-200 rounded-full w-3/4"></div>
                    <div class="h-1 bg-om-gray-100 rounded-full w-1/2"></div>
                    <div class="h-2 bg-om-gray-300 rounded w-2/3 mt-0.5"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-om-gray-700 truncate">Smart Discount Popup</div>
                  <div class="text-xs text-om-gray-400">domain.com</div>
                </div>
                <div class="flex shrink-0">
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Impressions</div><div class="text-sm font-semibold text-om-gray-700">12,841</div></div>
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Submit rate</div><div class="text-sm font-semibold text-om-gray-700">8.37%</div></div>
                </div>
                <div class="w-9 h-5 bg-[#2CC896] rounded-full shrink-0 opacity-90 flex items-center justify-end px-0.5"><div class="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </div>

              <!-- Row 2: Lucky wheel (side panel + wheel) -->
              <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-[0_1px_2px_1px_rgb(0_0_0/0.04)]">
                <div class="w-24 h-16 rounded-lg shrink-0 bg-om-gray-100 relative overflow-hidden border border-om-gray-100">
                  <!-- Side panel popup -->
                  <div class="absolute right-0 top-0 bottom-0 w-12 bg-white flex flex-col items-center justify-center gap-1 p-1">
                    <!-- Wheel circle -->
                    <div class="w-6 h-6 rounded-full border-2 border-om-gray-200 flex items-center justify-center shrink-0">
                      <div class="w-3 h-3 rounded-full bg-om-gray-200"></div>
                    </div>
                    <div class="h-1 bg-om-gray-200 rounded-full w-4/5"></div>
                    <div class="h-1.5 bg-om-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-om-gray-700 truncate">Lucky Wheel</div>
                  <div class="text-xs text-om-gray-400">domain.com</div>
                </div>
                <div class="flex shrink-0">
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Impressions</div><div class="text-sm font-semibold text-om-gray-700">7,203</div></div>
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Submit rate</div><div class="text-sm font-semibold text-om-gray-700">5.91%</div></div>
                </div>
                <div class="w-9 h-5 bg-[#2CC896] rounded-full shrink-0 opacity-90 flex items-center justify-end px-0.5"><div class="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </div>

              <!-- Row 3: Sticky bar (bottom bar popup) -->
              <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-[0_1px_2px_1px_rgb(0_0_0/0.04)]">
                <div class="w-24 h-16 rounded-lg shrink-0 bg-om-gray-100 relative overflow-hidden border border-om-gray-100">
                  <!-- Sticky bottom bar -->
                  <div class="absolute bottom-0 left-0 right-0 h-4 bg-white flex items-center justify-between px-1.5 gap-1">
                    <div class="h-1 bg-om-gray-200 rounded-full flex-1"></div>
                    <div class="h-2.5 bg-om-gray-300 rounded w-5 shrink-0"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-om-gray-700 truncate">Cart Abandonment Stopper</div>
                  <div class="text-xs text-om-gray-400">domain.com</div>
                </div>
                <div class="flex shrink-0">
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Impressions</div><div class="text-sm font-semibold text-om-gray-700">3,519</div></div>
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Submit rate</div><div class="text-sm font-semibold text-om-gray-700">11.24%</div></div>
                </div>
                <div class="w-9 h-5 bg-[#2CC896] rounded-full shrink-0 opacity-90 flex items-center justify-end px-0.5"><div class="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </div>

              <!-- Row 4: Survey/fullscreen (fades out) -->
              <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-[0_1px_2px_1px_rgb(0_0_0/0.04)] opacity-50">
                <div class="w-24 h-16 rounded-lg shrink-0 bg-om-gray-200 relative overflow-hidden border border-om-gray-100">
                  <!-- Fullscreen overlay -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                    <div class="h-1.5 bg-om-gray-400 rounded-full w-3/4"></div>
                    <div class="flex flex-col gap-0.5 w-full">
                      <div class="flex items-center gap-0.5">
                        <div class="w-1.5 h-1.5 rounded-full border border-om-gray-400 shrink-0"></div>
                        <div class="h-1 bg-om-gray-300 rounded-full flex-1"></div>
                      </div>
                      <div class="flex items-center gap-0.5">
                        <div class="w-1.5 h-1.5 rounded-full border border-om-gray-400 shrink-0"></div>
                        <div class="h-1 bg-om-gray-300 rounded-full flex-1"></div>
                      </div>
                    </div>
                    <div class="h-2 bg-om-gray-400 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-om-gray-700 truncate">Feedback Survey</div>
                  <div class="text-xs text-om-gray-400">domain.com</div>
                </div>
                <div class="flex shrink-0">
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Impressions</div><div class="text-sm font-semibold text-om-gray-700">1,088</div></div>
                  <div class="w-24"><div class="text-xs text-om-gray-400 mb-0.5">Submit rate</div><div class="text-sm font-semibold text-om-gray-700">2.10%</div></div>
                </div>
                <div class="w-9 h-5 bg-om-gray-200 rounded-full shrink-0 flex items-center justify-start px-0.5"><div class="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </div>
            </div>

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
import Button from '../components/shared/Button.vue'

defineEmits(['menu-click'])
</script>
