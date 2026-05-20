<template>
    <div class="row m-0 p-3 align-items-center" style="background-color: #f0a530;">
      <div class="col-auto">
        <Button :text="text" :type="'header'" />
      </div>
    </div>
</template>
<script setup>
    import Button from './Button.vue';
    defineProps ({
        text: {
            type: String,
            required: true,
        }
    });
</script>

<style scoped>
    
</style>