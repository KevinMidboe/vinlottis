<template>
  <transition name="modal-fade">
    <main class="modal-backdrop">
      <section class="modal">
        <header class="modal-header" v-if="headerText">
          {{headerText}}
        </header>
        <section class="modal-body">
          <p>
            {{modalText}}
          </p>
          <section class="button-container">
            <button v-for="(button, index) in buttons" :key="index" @click="modalButtonClicked(button.action)" class="vin-button">
              {{button.text}}
            </button>
          </section>
        </section>
      </section>
    </main>
  </transition>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      required: false
    },
    modalText: {
      type: String,
      required: true
    },
    buttons: {
      type: Array,
      required: true
    },
  },
  methods:{
    modalButtonClicked(action){
      this.$emit('modalBtnClicked', action)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100vw;
  height: 100vh;
}

.modal {
  background: #FFFFFF;
  -webkit-box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 22px 1px rgba(0, 0, 0, 0.65);
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}
</style>