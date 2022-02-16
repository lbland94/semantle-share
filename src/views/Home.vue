<template>
  <div class="sc-home">
    <p class="sc-label">Copy and paste your semantle guesses into this box.</p>
    <textarea class="semantle-result" v-model="semantleResult"></textarea>
    <button class="sc-share" @click.prevent="share">
      <span class="material-icons">share</span>
    </button>

    <div id="to-copy">
      <pre>{{ shareText }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { LineChart } from 'vue-chart-3';
import {
  formatDate,
  largestTriangleThreeBuckets,
  getSemantleNumber,
} from '@/utils/utils';
import ClipboardJS from 'clipboard';
import * as asciichart from 'asciichart';
import { POSITION, TYPE, useToast } from 'vue-toastification';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

export default defineComponent({
  name: 'HomeView',
  components: {
    // LineChart,
  },
  data: () => ({
    semantleResult: '',
    imgSrc: '',
    date: formatDate(Date.now()),
    semantleNumber: getSemantleNumber(Date.now()),
  }),
  computed: {
    lines(): Array<{ score: number; guess: string; number: number; logScore: number }> {
      const lineStrings = this.semantleResult
        .split('\n')
        .map((l) => l.trim().replaceAll(/\s+/g, ' '))
        .reverse();
      const mappedVals = lineStrings.map((l) => {
        let number = -1;
        let guess = '';
        let score = -1;
        let logScore = -1;
        try {
          const numberMatch = /(^\d+).*$/.exec(l);
          const guessMatch = /^\d+\s((?:\w+\s)+)(?:\d|\.)+.*?/.exec(l);
          const scoreMatch = /^\d+\s(?:\w+\s)+((?:\d|\.)+).*?/.exec(l);

          if (numberMatch && numberMatch.length === 2) {
            number = Number(numberMatch[1]);
          }
          if (guessMatch && guessMatch.length === 2) {
            guess = guessMatch[1];
          }
          if (scoreMatch && scoreMatch.length === 2) {
            score = Number(scoreMatch[1]);
            logScore = score;
          }
        } catch (e) {
          // something happened, oh no
        }
        return {
          score,
          guess,
          number,
          logScore,
        };
      });
      return mappedVals
        .filter((l) => l.guess !== '' && l.score > 0 && l.number > 0)
        .sort((a, b) => a.number - b.number);
    },
    plot(): string {
      return (
        (this.lines.length &&
          asciichart
            .plot(
              largestTriangleThreeBuckets(
                this.lines.map((l) => l.score),
                20
              ) as number[],
              { height: 5, offset: 3, padding: '' }
            )
            .replace(/^(\s+)?(\d|\.)+?\s/gm, '')
            .replace(/ +$/gm, '')
            .replace(/ /g, '⠀')) ||
        ''
      );
    },
    shareText(): string {
      return `${this.plot}\nsemantle ${this.semantleNumber}, ${this.lines.length} guesses`;
    },
  },
  methods: {
    async share() {
      ClipboardJS.copy(document.getElementById('to-copy') as Element, {});
      const toast = useToast();
      toast('copied to clipboard', {
        timeout: 1000,
        position: POSITION.BOTTOM_CENTER,
        draggable: false,
        closeOnClick: false,
        type: TYPE.INFO,
        pauseOnHover: false,
        toastClassName: 'sc-snackbar',
        hideProgressBar: true,
        icon: false,
        closeButton: false,
      });
    },
  },
});
</script>

<style lang="scss">
.sc-home {
  max-width: 100vw;
  padding-bottom: 100px;

  .semantle-result {
    border: 1px solid var(--sc-color-border);
    border-radius: 5px;
    padding: 5px;
    resize: none;
    max-width: 80%;
    width: 500px;
    max-height: 90%;
    height: 500px;
    white-space: pre;
  }
  .sc-share {
    background: var(--sc-primary-color);
    color: var(--sc-font-color);
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    transition: box-shadow 0.1s ease-in-out;
    &:hover {
      box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.2);
    }
    .material-icons {
      font-size: 30px;
      line-height: 50px;
      position: relative;
      left: -2px;
    }
  }
  #to-copy {
    text-align: left;
    padding-left: 8%;
  }
}
.Vue-Toastification__container .Vue-Toastification__toast.sc-snackbar {
  width: auto;
  min-width: 0;
  height: 30px;
  min-height: 0;
  background-color: var(--sc-icon-color-dark);
  color: var(--sc-font-color);
  margin: 0 auto 3px;
  padding: 3px 10px;
}
</style>
