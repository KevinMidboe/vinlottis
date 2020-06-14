<template>
  <div>
    <h1>Historie fra tidligere lotteri</h1>

    <div v-if="lotteries.length" v-for="lottery in lotteries">
      <Winners :winners="lottery.winners" :title="`Vinnere fra ${lottery.dateString}`" />
    </div>
  </div>
</template>

<script>
import { historyAll } from '@/api'
import Winners from '@/ui/Winners'

export default {
  name: 'History page of prev lotteries',
  components: { Winners },
  data() {
    return {
      lotteries: [],
    }
  },
  created() {
    historyAll()
      .then(history => this.lotteries = history.lotteries.reverse())
  }
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>