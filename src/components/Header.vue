<template>
    <div class="row m-0 p-3 align-items-center" style="background-color: #f0a530;">
      <div class="col-auto">
        <button class="btn btn-light d-flex align-items-center fw-bold px-3 py-1 custom-filter-btn" style="border-radius: 10px; font-size: 1.1rem;">
          <span class="me-2" style="color: #d48416; font-size: 1.3rem;">⬅</span> {{ text }}
        </button>
      </div>
    </div>
</template>
<script setup>
    defineProps ({
        text: {
            type: String,
            required: true,
        }
    });
</script>

<style scoped>
    .custom-filter-btn {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
    }
    .custom-filter-btn:active {
    transform: scale(0.95);
}</style>