<template>
  <div class="card" :class="isCurrent ? 'border border-dark' : {}">
    <div class="card-body">
      <div class="d-flex flex-column">
        <div v-for="(c, index) in colors"
             :key="index"
             style="width: 50px; height: 50px"
             :class="getClass(c)"
             class="p-2"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "item",
  props: {
    indexes: Array,
    sliceCount: Number,
    isCurrent: Boolean,
  },
  computed: {
    colors() {
      let result = [];
      for (let i = 0; i < this.sliceCount - this.indexes.length; i++) {
        result.push(-1);
      }
      for (let i = 0; i < this.indexes.length; i++) {
        result.push(this.indexes[i]);
      }
      return result;
    },
  },
  methods: {
    getClass(o: number): string {
      let result;

      switch (o) {
        case -1:
          result = "bg-white";
          break;
        case 0:
          result = "bg-primary";
          break;
        case 1:
          result = "bg-secondary";
          break;
        case 2:
          result = "bg-success";
          break;
        case 3:
          result = "bg-danger";
          break;
        case 4:
          result = "bg-warning";
          break;
        case 5:
          result = "bg-info";
          break;
        case 6:
          result = "bg-add-color-1";
          break;
        case 7:
          result = "bg-add-color-2";
          break;
        case 8:
          result = "bg-add-color-3";
          break;
      }
      return result;
    },
  },
});
</script>

<style></style>
