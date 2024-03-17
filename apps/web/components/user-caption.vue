<template>
  <div class="flex items-stretch">
    <div class="flex flex-col justify-center">
      <slot name="avatar" />
    </div>
    <div class="flex flex-col justify-around h-inhreit flex-1">
      <div>
        <slot name="title" />
      </div>
      <div>
        <slot name="caption" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-inhreit {
  height: inherit;
}
</style>
