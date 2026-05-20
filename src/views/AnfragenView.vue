<script setup>
import { computed } from 'vue';

import Header from '@/components/Header.vue';
import LogoAndTitle from '@/components/LogoAndTitle.vue';
import AnfrageCard from '@/components/AnfrageCard.vue';

import { anfragen } from '@/data.js';
import { useAnfragenFilterStore } from '@/anfragenFilter';

const filterStore = useAnfragenFilterStore();

const filteredAnfragen = computed(() => {
  return anfragen.filter((anfrage) => {
    const matchesCategory =
      !filterStore.category ||
      anfrage.kategorie === filterStore.category;

    const matchesStatus =
      !filterStore.status ||
      anfrage.status === filterStore.status;

    const matchesPeriod =
      !filterStore.period ||
      anfrage.erstellungsdatum === filterStore.period;

    const matchesCustomer =
      !filterStore.username ||
      anfrage.kunde.toLowerCase().includes(filterStore.username.toLowerCase());

    const matchesRequestId =
      !filterStore.requestId ||
      String(anfrage.id).includes(filterStore.requestId);

    return (
      matchesCategory &&
      matchesStatus &&
      matchesPeriod &&
      matchesCustomer &&
      matchesRequestId
    );
  });
});

function getAnfragen() {
  return filteredAnfragen.value;
}
</script>

<template>
  <div class="container-fluid bg-white min-vh-100 p-0 shadow-sm">
    <Header text="Filter" />

    <div class="row m-0 text-center justify-content-center pt-4">
      <LogoAndTitle :title="'Anfragen'" :subtitle="'Gefilterte Kundenanfragen'" />
    </div>

    <div class="row m-0 px-2 px-md-5 pb-5 g-3 g-md-4">
      <div
        v-for="anfrage in getAnfragen()"
        :key="anfrage.id"
        class="col-12 col-md-4 col-xl-3"
      >
        <AnfrageCard :anfrage="anfrage" />
      </div>
    </div>
  </div>
</template>
