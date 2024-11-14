<template>
  <!-- Ripple Animation -->
  <div class="lds-ripple">
    <div></div>
    <div></div>
  </div>

  <!-- Loading Text -->
  <div class="text-2xl text-theme-1-color-1 font-bold">Loading...</div>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

.lds-ripple {
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #3F51B5;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
</style>
