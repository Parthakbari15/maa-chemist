<template>
  <div
    :class="[
      'card relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
      customClass
    ]"
  >
    <!-- Background decoration -->
    <div
      :class="[
        'absolute top-0 right-0 w-32 h-32 rounded-full opacity-10',
        bgColor
      ]"
      style="transform: translate(20px, -20px);"
    ></div>
    
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'p-3 rounded-lg',
              bgColor
            ]"
          >
            <component :is="icon" :class="['h-6 w-6', iconColor]" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
            <p class="text-xs text-gray-500">{{ subtitle }}</p>
          </div>
        </div>
        
        <!-- Trend indicator -->
        <div v-if="trend" class="flex items-center space-x-1">
          <component
            :is="trend.isUp ? TrendingUp : TrendingDown"
            :class="[
              'h-4 w-4',
              trend.isUp ? 'text-green-500' : 'text-red-500'
            ]"
          />
          <span
            :class="[
              'text-sm font-medium',
              trend.isUp ? 'text-green-500' : 'text-red-500'
            ]"
          >
            {{ trend.value }}%
          </span>
        </div>
      </div>
      
      <!-- Value -->
      <div class="mb-2">
        <p class="text-2xl font-bold text-gray-900">
          {{ formattedValue }}
        </p>
      </div>
      
      <!-- Additional info -->
      <div v-if="additionalInfo" class="flex items-center space-x-2">
        <div class="h-1 w-1 bg-gray-400 rounded-full"></div>
        <p class="text-xs text-gray-500">{{ additionalInfo }}</p>
      </div>
      
      <!-- Progress bar (optional) -->
      <div v-if="progress !== undefined" class="mt-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-500">Progress</span>
          <span class="text-xs text-gray-700 font-medium">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="[
              'h-2 rounded-full transition-all duration-500',
              progressColor
            ]"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: [String, Object],
    required: true
  },
  customClass: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: 'bg-blue-100'
  },
  iconColor: {
    type: String,
    default: 'text-blue-600'
  },
  trend: {
    type: Object,
    default: null
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'number', // 'number', 'currency', 'percentage'
  }
})

const formattedValue = computed(() => {
  const val = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  
  if (isNaN(val)) return props.value
  
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val)
    
    case 'percentage':
      return `${val.toFixed(1)}%`
    
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(val)
  }
})

const progressColor = computed(() => {
  if (props.progress >= 80) return 'bg-green-500'
  if (props.progress >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
})
</script>
