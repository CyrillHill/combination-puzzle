<template>
  <div id="app">
    <game></game>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Game from "@/components/Game.vue";

export default defineComponent({
  name: "App",
  components: {
    Game,
  },
});
</script>
