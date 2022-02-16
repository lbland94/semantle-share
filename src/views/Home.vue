<template>
  <div class="sc-home">
    <p class="sc-label">Copy and paste your semantle guesses into this box.</p>
    <textarea class="semantle-result" v-model="semantleResult"></textarea>
    <!-- <div class="semantle-chart-container"> -->
    <!-- <LineChart
        ref="chart"
        chart-id="sem-chart-id"
        class="semantle-chart"
        type="line"
        :wrapper="false"
        :chart-data="{
          labels: lines.map((v, i) =>
            i === 0 ||
            i === lines.length - 1 ||
            Math.floor(i / (lines.length / 8)) > (i - 1) / (lines.length / 8)
              ? i + 1
              : ''
          ),
          datasets: [
            {
              backgroundColor: 'rgba(220, 220, 220, 0.2)',
              borderColor: 'rgba(0, 0, 220, 1)',
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              data: lines.map((l) => l.logScore),
              tension: 0.5,
            },
          ],
        }"
        :plugins="[plugin]"
        :options="{
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            yScale: {
              position: 'right', // `axis` is determined by the position as `'y'`
              min: 0,
              max: 100,
              ticks: {
                display: false,
              },
              grid: {
                drawOnChartArea: false,
                drawTicks: false,
              },
            },
            xScale: {
              ticks: {
                maxTicksLimit: 10,
                maxRotation: 0,
                autoSkip: false,
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          events: [],
        }"
      ></LineChart> -->
    <!-- <div class="semantle-chart-height"></div>
    </div> -->
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
    plugin: {
      id: 'semantle_chart_background',
      // beforeDraw: (chart: Chart) => {
      //   const ctx = chart.canvas.getContext('2d');
      //   if (ctx) {
      //     ctx.save();
      //     ctx.globalCompositeOperation = 'destination-over';
      //     ctx.lineWidth = 2;
      //     ctx.strokeStyle = '#aaa';
      //     ctx.strokeRect(0, 0, chart.width, chart.height);
      //     ctx.fillStyle = '#aaa';
      //     ctx.textAlign = 'left';
      //     const bgString = 'semantle ' + formatDate(Date.now());
      //     ctx.font = '24px sans-serif';
      //     let size = ctx.measureText(bgString);
      //     let fs = 24;
      //     while (size.width > chart.width / 3) {
      //       ctx.font = `${--fs}px sans-serif`;
      //       size = ctx.measureText(bgString);
      //     }
      //     ctx.fillText(bgString, 10, fs / 2 + 10);
      //     ctx.fillStyle = 'white';
      //     ctx.fillRect(0, 0, chart.width, chart.height);
      //     ctx.restore();
      //   }
      // },
    },
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const chartParent = this.$refs.chart as any;
      // chartParent.chartInstance.config.options.responsive = false;
      // chartParent.chartInstance.resize(1000, 1000);
      // chartParent.chartInstance.update();
      // const image = chartParent.chartInstance.toBase64Image('image/jpg', 1);
      // this.imgSrc = image;
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
  .semantle-chart-container {
    max-width: 90%;
    width: 500px;
    position: relative;
    margin: 10px auto 0;
  }
  .semantle-chart-height {
    position: relative;
    padding-bottom: 50%;
  }
  .semantle-chart {
    position: absolute !important;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
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
