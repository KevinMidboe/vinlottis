<template>
  <div>
    <h1>Historie fra tidligere lotteri</h1>

    <div v-if="lotteries.length || lotteries != null" v-for="lottery in lotteries">
      <Winners :winners="lottery.winners" :title="`Vinnere fra ${ humanReadableDate(lottery.date) }`" />
    </div>
  </div>
</template>

<script>
import { historyByDate, historyAll } from '@/api'
import { humanReadableDate } from "@/utils";
import Winners from '@/ui/Winners'

export default {
  name: 'History page of prev lotteries',
  components: { Winners },
  data() {
    return {
      lotteries: [],
    }
  },
  methods: {
    humanReadableDate: humanReadableDate
  },
  created() {
    const dateFromUrl = this.$route.params.date;

    if (dateFromUrl !== undefined)
      historyByDate(dateFromUrl)
        .then(history => this.lotteries = { "lottery": history })
    else
      historyAll()
        .then(history => this.lotteries = history.lotteries)
  }
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>