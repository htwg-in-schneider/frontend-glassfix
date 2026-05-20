<script setup>
import { useRouter } from 'vue-router';
import Button from './Button.vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  }
});

const router = useRouter();

function handleHeaderClick() {
  if (props.text === 'Filter') {
    router.push('/filter');
  }

  if (props.text === 'Anfragen') {
    router.push('/anfragen');
  }

  if (props.text === 'Dashboard') {
    router.push('/dashboard');
  }
  if (props.text === 'Startseite') {
    router.push('/');
  }
}
</script>

<template>
  <div class="row m-0 p-3 align-items-center" style="background-color: #f0a530;">
    <div class="col-auto">
      <Button
        :text="text"
        :type="'header'"
        :onClick="handleHeaderClick"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
