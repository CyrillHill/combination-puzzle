<template>
  <div v-if="game.isGameOver">
    <div
      class="d-flex justify-content-center align-items-center"
      style="height: 100px"
    >
      <div>
        <h1><span class="badge badge-secondary">GAME OVER</span></h1>
      </div>
    </div>
  </div>
  <div v-else>
<!--        {{ game }}-->
    <div style="margin-top: 25px" class="d-flex justify-content-center">
      <item
        @click="onClick(index)"
        v-for="(c, index) in game.items"
        :key="index"
        :sliceCount="game.sliceCount"
        :indexes="c"
        :isCurrent="isCurrent(index) && !game.isFirstStep"
      ></item>
    </div>
    <div
      v-if="isWin"
      class="d-flex justify-content-center align-items-center"
      style="height: 100px"
    >
      <div>
        <h1><span class="badge badge-secondary">YOU WON!</span></h1>
      </div>
    </div>
  </div>
  <div
          class="d-flex justify-content-center align-items-center"
          style="height: 100px"
  >
    <button class="btn btn-lg btn-dark" @click="startNewGame()">
      START NEW GAME
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Game from "@/types/Game";
import Item from "@/components/Item.vue";
import Utils from "@/services/utils";


export default defineComponent({
  name: "game",
  components: {
    Item,
  },
  data() {
    return {
      game: {} as Game,
    };
  },
  computed: {
    isWin() {
      let result = true;
      if (this.game.items)
        this.game.items.forEach(
          (i) => (result = result && i.every((val, i, arr) => val === arr[0]))
        );
      return result;
    },
  },
  methods: {
    onClick(idx: number, recursive = false) {
      if (this.isCorrectColumn(idx)) return;

      if (this.game.isFirstStep) {
        const lastEmIdx = this.getLastEmptyIdx(this.game.items[idx]);
        if (lastEmIdx == this.game.sliceCount - 1) return;
        this.game.isFirstStep = false;
        this.game.currentItem = idx;
      } else {
        // отмена при повторном нажатии на тот же элемент
        if (idx == this.game.currentItem) {
          this.game.isFirstStep = true;
          return;
        }
        const lastEmIdx = this.getLastEmptyIdx(this.game.items[idx]);

        if (lastEmIdx == undefined) return;
        const currentColumn = this.game.items[this.game.currentItem];
        let lastEmIdxCurrCol = this.getLastEmptyIdx(currentColumn);
        lastEmIdxCurrCol = lastEmIdxCurrCol || lastEmIdxCurrCol == 0 ? lastEmIdxCurrCol + 1 : 0;

        const selectedElement = this.game.items[this.game.currentItem][lastEmIdxCurrCol];

        // проверяем вмещаются ли все блоки одного цвета на новое место
        if (
          !recursive &&
          this.getLengthByColor(lastEmIdxCurrCol) > lastEmIdx + 1
        ) {
          return;
        }
        // перемещение только одно цвета
        if (selectedElement != this.game.items[idx][lastEmIdx + 1]) {
          if (lastEmIdx != this.game.sliceCount - 1) return;
        }
        this.game.items[this.game.currentItem].splice(lastEmIdxCurrCol, 1, -1);
        this.game.items[idx].splice(lastEmIdx, 1, selectedElement);
        if (selectedElement == this.game.items[this.game.currentItem][lastEmIdxCurrCol + 1]) {
          this.onClick(idx, true);
        }
        this.game.isFirstStep = true;
      }
    },

    isCorrectColumn(idx: number) {
      const items = this.game.items;
      const firstIsNoEmpty = items[idx][0] != -1;
      return firstIsNoEmpty && items[idx].every((val, i, arr) => val === arr[0]);
    },

    init() {
      console.log("init");

      this.game.sliceCount = 4;
      this.startNewGame();
    },

    getLengthByColor(indx: number) {
      let result = 1;
      const el = this.game.items[this.game.currentItem][indx];
      let isCorrect = true;
      let pos = indx + 1;
      while (isCorrect) {
        if (el == this.game.items[this.game.currentItem][pos]) {
          pos++;
          result++;
        } else {
          break;
        }
      }
      return result;
    },

    getLastEmptyIdx(arr: Array<number>): number {
      let result;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0) result = i;
      }
      return result;
    },

    startNewGame() {
      this.game.itemCount = Utils.getRandomInt(11, 6);
      this.game.colorCount = this.game.itemCount - 2;
      this.game.isGameOver = false;
      this.game.isFirstStep = true;
      this.game.items = [];

      let tmpItem = [];
      for (let i = 0; i < this.game.colorCount; i++) {
        tmpItem[i] = this.game.sliceCount;
      }

      for (let i = 0; i < this.game.colorCount; i++) {
        let item = [];
        for (let j = 0; j < this.game.sliceCount; j++) {
          let idx;
          let isCorrect = true;
          while (isCorrect) {
            idx = Math.floor(Math.random() * this.game.colorCount);
            if (tmpItem[idx] > 0) {
              tmpItem[idx]--;
              isCorrect = false;
              break;
            }
          }
          item.push(idx);
        }
        this.game.items.push(item);
      }
      this.game.items.push(new Array(this.game.sliceCount).fill(-1));
      this.game.items.push(new Array(this.game.sliceCount).fill(-1));
    },

    isCurrent(idx) {
      return this.game.currentItem == idx;
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<style></style>
