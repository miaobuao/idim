<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'

import { screen } from '../../utils/screen'

definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <user-individual-center v-if="screen.lt.md.value" />
  <div v-else v-auto-animate>
    <user-individual-center />
  </div>
</template>
